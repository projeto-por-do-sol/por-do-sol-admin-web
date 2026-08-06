import { Component, input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

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
  name = input.required<string>()
  placeholder = input<string>()
  isObrigatory = input<boolean>(true)

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
    if (!control || !control.touched || !control.errors) return null

    if (control.errors['required']) return 'Campo obrigatório'
    if (control.errors['email']) return 'E-mail inválido'
    if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`

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
    this.value = value
    this.onChange(value)
  }

  handleBlur() {
    this.onTouched()
  }
}