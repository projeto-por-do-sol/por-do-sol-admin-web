import { Component, computed, DestroyRef, ElementRef, inject, signal, viewChildren } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ReturnLink } from '../../shared/ui/return-link/return-link'
import { Button } from '../../shared/ui/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  imports: [FormsModule, ReturnLink, Button],
  templateUrl: './password-recovery.html'
})
export class PasswordRecovery {
  private readonly storageKey = 'password-recovery-state-v2'
  private readonly destroyRef = inject(DestroyRef)
  private readonly router = inject(Router)
  readonly code = ['', '', '', '']
  readonly codeErrorMessage = signal('')
  readonly codeSuccessMessage = signal('')
  readonly resendMessage = signal('')
  readonly now = signal(Date.now())
  readonly usedAttempts = signal(0)
  readonly lockedUntil = signal(0)
  readonly usedRequests = signal(0)
  readonly requestsLockedUntil = signal(0)
  readonly resendAvailableAt = signal(this.now() + 60_000)
  readonly lockSeconds = computed(() => Math.max(0, Math.ceil((this.lockedUntil() - this.now()) / 1000)))
  readonly requestLockSeconds = computed(() => Math.max(0, Math.ceil((this.requestsLockedUntil() - this.now()) / 1000)))
  readonly resendSeconds = computed(() => Math.max(0, Math.ceil((this.resendAvailableAt() - this.now()) / 1000)))
  readonly isLocked = computed(() => this.lockSeconds() > 0)
  readonly areRequestsLocked = computed(() => this.requestLockSeconds() > 0)
  readonly remainingAttempts = computed(() => 5 - this.usedAttempts())
  readonly remainingRequests = computed(() => 5 - this.usedRequests())
  private readonly codeInputs = viewChildren<ElementRef<HTMLInputElement>>('codeInput')

  constructor() {
    this.restoreState()
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

    if (this.isLocked()) return

    if (this.code.some(character => !character)) {
      this.codeErrorMessage.set('Preencha os quatro caracteres do código.')
      return
    }

    // TODO: Substituir pelo serviço de validação quando a API de recuperação estiver disponível.
    if (this.code.join('') !== '1234') {
      const remaining = this.consumeAttempt()
      this.codeErrorMessage.set(remaining === 0
        ? 'Limite de tentativas atingido.'
        : `Código incorreto. Restam ${remaining} tentativas.`)
      return
    }

    this.usedAttempts.set(0)
    this.saveState()
    this.codeErrorMessage.set('')
    this.codeSuccessMessage.set('Código confirmado.')
    this.router.navigateByUrl('/passwordReset')
  }

  requestNewCode(): void {
    if (this.areRequestsLocked() || this.resendSeconds() > 0) return

    // TODO: Integrar o envio real por e-mail quando houver um serviço de recuperação.
    const currentTime = Date.now()
    this.now.set(currentTime)
    this.resendMessage.set('Solicitação simulada: o envio por e-mail ainda não está configurado.')
    this.resendAvailableAt.set(currentTime + 60_000)
    this.consumeRequest(currentTime)
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

  private consumeAttempt(): number {
    const used = this.usedAttempts() + 1
    this.usedAttempts.set(used)
    if (used >= 5) {
      const currentTime = Date.now()
      this.now.set(currentTime)
      this.lockedUntil.set(currentTime + 10 * 60_000)
    }
    this.saveState()
    return Math.max(0, 5 - used)
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
    if (this.lockedUntil() && !this.isLocked()) {
      this.lockedUntil.set(0)
      this.usedAttempts.set(0)
      this.codeErrorMessage.set('')
      changed = true
    }
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

      const state = JSON.parse(saved) as { usedAttempts: number; lockedUntil: number; usedRequests: number; requestsLockedUntil: number; resendAvailableAt: number }
      const currentTime = Date.now()
      const attemptsExpired = state.lockedUntil > 0 && state.lockedUntil <= currentTime
      const requestsExpired = state.requestsLockedUntil > 0 && state.requestsLockedUntil <= currentTime
      this.lockedUntil.set(state.lockedUntil > currentTime ? state.lockedUntil : 0)
      this.requestsLockedUntil.set(state.requestsLockedUntil > currentTime ? state.requestsLockedUntil : 0)
      this.usedAttempts.set(attemptsExpired ? 0 : this.lockedUntil() ? 5 : Math.min(4, Math.max(0, state.usedAttempts || 0)))
      this.usedRequests.set(requestsExpired ? 0 : this.areRequestsLocked() ? 5 : Math.min(4, Math.max(0, state.usedRequests || 0)))
      this.resendAvailableAt.set(state.resendAvailableAt > Date.now() ? state.resendAvailableAt : 0)
    } catch {
      // O formulário continua funcionando se o armazenamento do navegador estiver indisponível.
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        usedAttempts: this.usedAttempts(),
        lockedUntil: this.lockedUntil(),
        usedRequests: this.usedRequests(),
        requestsLockedUntil: this.requestsLockedUntil(),
        resendAvailableAt: this.resendAvailableAt(),
      }))
    } catch {
      // O formulário continua funcionando se o armazenamento do navegador estiver indisponível.
    }
  }

}
