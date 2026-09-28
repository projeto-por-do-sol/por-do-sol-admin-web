import { Component, ElementRef, signal, viewChildren } from '@angular/core'
import { ReturnLink } from '../../shared/ui/return-link/return-link'
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-password-recovery',
  imports: [ReturnLink, Button, ],
  templateUrl: './password-recovery.html'
})
export class PasswordRecovery {
  readonly code = ['', '', '', '']
  readonly codeErrorMessage = signal('')
  readonly codeSuccessMessage = signal('')
  private readonly codeInputs = viewChildren<ElementRef<HTMLInputElement>>('codeInput')

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

    // TODO: Substituir pelo serviço de validação quando a API de recuperação estiver disponível.
    if (this.code.join('') !== '1234') {
      this.codeErrorMessage.set('Código incorreto. Verifique e tente novamente.')
      return
    }

    this.codeErrorMessage.set('')
    this.codeSuccessMessage.set('Código confirmado.')
  }

  private fillCode(index: number, value: string): void {
    const characters = value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, this.code.length - index)
    if (!characters) {
      this.code[index] = ''
      this.clearMessages()
      return
    }

    for (let offset = 0; offset < characters.length; offset++) {
      this.code[index + offset] = characters[offset]
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
