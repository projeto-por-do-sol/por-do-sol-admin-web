import { Component, computed, DestroyRef, ElementRef, inject, signal, viewChildren } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ReturnLink } from '../../shared/ui/return-link/return-link'
import { Button } from '../../shared/ui/button/button';
import { Router } from '@angular/router';
import { PasswordRecoveryService, recoveryErrorMessage, recoveryQuota } from '../../services/password-recovery-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-password-recovery',
  imports: [FormsModule, ReturnLink, Button],
  templateUrl: './password-recovery.html'
})
export class PasswordRecovery {
  private readonly destroyRef = inject(DestroyRef)
  private readonly router = inject(Router)
  private readonly recovery = inject(PasswordRecoveryService)
  readonly code = ['', '', '', '']
  readonly codeErrorMessage = signal('')
  readonly codeSuccessMessage = signal('')
  readonly resendMessage = signal('')
  readonly isResending = signal(false)
  readonly isValidating = signal(false)
  readonly now = signal(Date.now())
  private readonly quota = computed(() => recoveryQuota(this.recovery.sendTimes(), this.now()))
  readonly requestLockSeconds = computed(() => Math.max(0, Math.ceil((this.quota().lockedUntil - this.now()) / 1000)))
  readonly resendSeconds = computed(() => Math.max(0, Math.ceil((this.quota().resendAvailableAt - this.now()) / 1000)))
  readonly areRequestsLocked = computed(() => this.requestLockSeconds() > 0)
  readonly remainingRequests = computed(() => this.quota().remaining)
  private readonly codeInputs = viewChildren<ElementRef<HTMLInputElement>>('codeInput')

  constructor() {
    if (!this.recovery.hasPendingRecovery) {
      this.router.navigateByUrl('/informEmailForRecovery')
    } else if (this.recovery.accountType === 'FUNCIONARIO') {
      this.router.navigateByUrl('/login')
    }
    const timer = setInterval(() => this.now.set(Date.now()), 1000)
    this.destroyRef.onDestroy(() => clearInterval(timer))
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement
    const characters = input.value.replace(/[^a-z0-9]/gi, '').toUpperCase()

    if (characters.length > 1) {
      this.fillCode(index, characters)
      return
    }

    this.code[index] = characters
    input.value = characters
    this.clearMessages()
    if (characters && index < this.code.length - 1) {
      this.focusInput(index + 1)
    }
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key !== 'Backspace') return

    event.preventDefault()
    const targetIndex = this.code[index] || index === 0 ? index : index - 1
    this.code[targetIndex] = ''
    this.codeInputs()[targetIndex].nativeElement.value = ''
    this.clearMessages()
    if (targetIndex !== index) this.focusInput(targetIndex)
  }

  onPaste(index: number, event: ClipboardEvent): void {
    event.preventDefault()
    this.fillCode(index, event.clipboardData?.getData('text') ?? '')
  }

  confirmCode(): void {
    this.codeSuccessMessage.set('')

    if (this.code.some(character => !character)) {
      this.codeErrorMessage.set('Preencha os quatro caracteres do código.')
      return
    }

    if (this.isValidating()) return

    this.isValidating.set(true)
    this.recovery.validateCode(this.code.join('')).subscribe({
      next: () => {
        this.isValidating.set(false)
        this.codeErrorMessage.set('')
        this.codeSuccessMessage.set('Código confirmado.')
        this.router.navigateByUrl('/passwordReset')
      },
      error: (error: HttpErrorResponse) => {
        this.isValidating.set(false)
        this.codeErrorMessage.set(error.status === 400
          ? 'Código incorreto ou expirado.'
          : recoveryErrorMessage(error, 'Não foi possível confirmar o código. Tente novamente.'))
      },
    })
  }

  requestNewCode(): void {
    if (this.areRequestsLocked() || this.resendSeconds() > 0 || this.isResending()) return

    this.isResending.set(true)
    this.resendMessage.set('')
    this.recovery.resend().subscribe({
      next: () => {
        this.now.set(Date.now())
        this.resendMessage.set('Se o e-mail estiver cadastrado, um novo código foi enviado.')
        this.isResending.set(false)
      },
      error: (error: HttpErrorResponse) => {
        this.resendMessage.set(recoveryErrorMessage(error, 'Não foi possível reenviar o código. Tente novamente.'))
        this.isResending.set(false)
      },
    })
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
    const remainder = (seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${remainder}`
  }

  private fillCode(index: number, value: string): void {
    const characters = value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, this.code.length - index)
    if (!characters) {
      this.code[index] = ''
      this.codeInputs()[index].nativeElement.value = ''
      this.clearMessages()
      return
    }

    for (let offset = 0; offset < characters.length; offset++) {
      this.code[index + offset] = characters[offset]
      this.codeInputs()[index + offset].nativeElement.value = characters[offset]
    }
    this.clearMessages()
    this.focusInput(Math.min(index + characters.length, this.code.length - 1))
  }

  private focusInput(index: number): void {
    this.codeInputs()[index]?.nativeElement.focus()
  }

  private clearMessages(): void {
    this.codeErrorMessage.set('')
    this.codeSuccessMessage.set('')
  }
}
