import { Component, ElementRef, input, model, output, viewChildren } from '@angular/core';

export const VERIFICATION_CODE_LENGTH = 4

export function emptyVerificationCode(): string[] {
  return Array(VERIFICATION_CODE_LENGTH).fill('')
}

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.html',
})
export class VerificationCode {
  readonly digits = model<string[]>(emptyVerificationCode())
  readonly error = input<string | null>(null)
  readonly confirm = output<void>()

  private readonly codeInputs = viewChildren<ElementRef<HTMLInputElement>>('codeInput')

  readonly codeLength = VERIFICATION_CODE_LENGTH
  readonly codeSlots = Array.from({ length: this.codeLength }, (_, index) => index)

  focus(index = 0): void {
    this.codeInputs()[index]?.nativeElement.focus()
  }

  onCodeInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement
    const digits = input.value.replace(/[^a-z0-9]/gi, '').toUpperCase()

    const next = [...this.digits()]
    for (let i = 0; i < digits.length && index + i < this.codeLength; i++) {
      next[index + i] = digits[i]
    }
    if (!digits) next[index] = ''
    this.digits.set(next)
    input.value = next[index]

    if (digits) this.focus(Math.min(index + digits.length, this.codeLength - 1))
  }

  onCodeKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      this.focus(index - 1)
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focus(index - 1)
    } else if (event.key === 'ArrowRight' && index < this.codeLength - 1) {
      this.focus(index + 1)
    } else if (event.key === 'Enter') {
      this.confirm.emit()
    }
  }
}
