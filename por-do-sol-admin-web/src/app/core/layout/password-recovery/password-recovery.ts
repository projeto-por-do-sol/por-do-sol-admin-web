import { Component, computed, DestroyRef, ElementRef, inject, signal, viewChildren } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ReturnLink } from '../../shared/ui/return-link/return-link'
import { Button } from '../../shared/ui/button/button';
import { Router } from '@angular/router';
import { PasswordRecoveryService, recoveryErrorMessage } from '../../services/password-recovery-service';
import { HttpErrorResponse } from '@angular/common/http';

// A API só reenvia o código após 5 minutos; antes disso ela ignora a solicitação.
const RESEND_INTERVAL_MS = 5 * 60_000 + 5_000 // margem para diferença de relógio com a API

@Component({
  selector: 'app-password-recovery',
  imports: [FormsModule, ReturnLink, Button],
  templateUrl: './password-recovery.html'
})
export class PasswordRecovery {
  private readonly storageKey = 'password-recovery-state-v3'
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
  readonly usedRequests = signal(0)
  readonly requestsLockedUntil = signal(0)
  readonly resendAvailableAt = signal(0)
  readonly requestLockSeconds = computed(() => Math.max(0, Math.ceil((this.requestsLockedUntil() - this.now()) / 1000)))
  readonly resendSeconds = computed(() => Math.max(0, Math.ceil((this.resendAvailableAt() - this.now()) / 1000)))
  readonly areRequestsLocked = computed(() => this.requestLockSeconds() > 0)
  readonly remainingRequests = computed(() => 5 - this.usedRequests())
  private readonly codeInputs = viewChildren<ElementRef<HTMLInputElement>>('codeInput')

  constructor() {
    if (!this.recovery.hasPendingRecovery) {
      this.router.navigateByUrl('/informEmailForRecovery')
    } else if (this.recovery.accountType === 'FUNCIONARIO') {
      this.router.navigateByUrl('/login')
    }
    this.restoreState()
    // O prazo parte do envio real da API, não do carregamento da tela nem do localStorage.
    this.resendAvailableAt.set(this.recovery.lastSentAt + RESEND_INTERVAL_MS)
    this.saveState()
    const timer = setInterval(() => this.updateTime(), 1000)
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
        const currentTime = Date.now()
        this.now.set(currentTime)
        this.resendMessage.set('Se o e-mail estiver cadastrado, um novo código foi enviado.')
        this.resendAvailableAt.set(currentTime + RESEND_INTERVAL_MS)
        this.consumeRequest(currentTime)
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

  private consumeRequest(currentTime: number): void {
    const used = this.usedRequests() + 1
    this.usedRequests.set(used)
    if (used >= 5) this.requestsLockedUntil.set(currentTime + 10 * 60_000)
    this.saveState()
  }

  private updateTime(): void {
    this.now.set(Date.now())
    let changed = false
    if (this.requestsLockedUntil() && !this.areRequestsLocked()) {
      this.requestsLockedUntil.set(0)
      this.usedRequests.set(0)
      changed = true
    }
    if (changed) this.saveState()
  }

  private restoreState(): void {
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (!saved) return

      const state = JSON.parse(saved) as { usedRequests: number; requestsLockedUntil: number }
      const currentTime = Date.now()
      const requestsExpired = state.requestsLockedUntil > 0 && state.requestsLockedUntil <= currentTime
      this.requestsLockedUntil.set(state.requestsLockedUntil > currentTime ? state.requestsLockedUntil : 0)
      this.usedRequests.set(requestsExpired ? 0 : this.areRequestsLocked() ? 5 : Math.min(4, Math.max(0, state.usedRequests || 0)))
    } catch {
      // O formulário continua funcionando se o armazenamento do navegador estiver indisponível.
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        usedRequests: this.usedRequests(),
        requestsLockedUntil: this.requestsLockedUntil(),
      }))
    } catch {
      // O formulário continua funcionando se o armazenamento do navegador estiver indisponível.
    }
  }

}
