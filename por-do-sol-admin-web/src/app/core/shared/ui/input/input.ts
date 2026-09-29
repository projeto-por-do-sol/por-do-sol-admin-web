import { Component, ElementRef, input, Optional, Self, viewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { formatCnpj } from '../../../utils/cnpj';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input implements ControlValueAccessor {

  id = input.required<string>()
  label = input.required<string>()
  type = input<string>('text')
  step = input<string>()
  name = input.required<string>()
  placeholder = input<string>()
  isObrigatory = input<boolean>(true)
  mask = input<'cnpj' | 'phone' | 'currency' | null>(null)
  viewPassword = false
  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement')

  get inputId(): string {
    return `input-${this.id()}`
  }

  focusInput(): void {
    this.inputElement()?.nativeElement.focus()
  }

  value: string = ""
  disabled = false

  private onChange: (value: string) => void = () => { }
  private onTouched: () => void = () => { }

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this
    }
  }

  get errorMessage(): string | null {
    const control = this.ngControl?.control
    if (!control || !control.touched) return null
    if (this.name() === 'passwordConfirmation' && control.parent?.errors?.['passwordMismatch']) {
      return 'As senhas não coincidem'
    }
    if (!control.errors) return null

    if (control.errors['required']) return 'Campo obrigatório'
    if (control.errors['email']) return 'E-mail inválido'
    if (control.errors['cnpj']) return 'CNPJ inválido'
    if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`
    if (control.errors['pattern']) return 'Formato inválido'

    return 'Campo inválido'
  }

  writeValue(value: string): void {
    this.value = value ?? ""
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  handleInput(value: string) {
    if (this.mask() === 'cnpj') {
      this.value = formatCnpj(value)
    } else if (this.mask() === 'phone') {
      this.value = this.formatPhone(value)
    } else if (this.mask() === 'currency') {
      this.value = this.formatCurrency(value)
    } else {
      this.value = value
    }
    this.onChange(this.value)
  }

  private formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (!digits) return ''
    if (digits.length < 3) return `(${digits}`

    const areaCode = digits.slice(0, 2)
    const phoneNumber = digits.slice(2)
    const separatorIndex = phoneNumber.length > 8 ? 5 : 4
    const firstPart = phoneNumber.slice(0, separatorIndex)
    const lastPart = phoneNumber.slice(separatorIndex)
    return `(${areaCode}) ${firstPart}${lastPart ? `-${lastPart}` : ''}`
  }

  private formatCurrency(value: string): string {
    const digits = value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 11)
    if (!digits) return ''

    return (Number(digits) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  handleBlur() {
    this.onTouched()
  }

  toggleViewPassword(){
    this.viewPassword = !this.viewPassword
  }

  inputType(){
    if (this.type() === "password"){
      return this.viewPassword ? "text" : "password"
    }
    return this.type()
  }
}
