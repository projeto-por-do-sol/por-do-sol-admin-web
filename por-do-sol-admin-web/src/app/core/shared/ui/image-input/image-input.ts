import { Component, ElementRef, input, Optional, output, Self, viewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-image-input',
  imports: [],
  templateUrl: './image-input.html',
  styleUrl: './image-input.css',
})
export class ImageInput implements ControlValueAccessor {
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput')
  id = input<string>('image-upload')
  label = input<string>('Foto de perfil')
  hint = input<string>('PNG, JPG ou WEBP de até 5 MB')
  accept = input<string>('image/png,image/jpeg,image/webp')
  imageSelected = output<string | null>()

  previewUrl: string | null = null
  fileName = ''
  disabled = false
  errorMessage = ''

  private onChange: (value: File | null) => void = () => undefined
  private onTouched: () => void = () => undefined

  constructor(@Optional() @Self() public ngControl: NgControl | null) {
    if (this.ngControl) this.ngControl.valueAccessor = this
  }

  handleFile(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    const file = inputElement.files?.[0] ?? null
    this.onTouched()
    this.errorMessage = ''

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Selecione um arquivo de imagem'
      inputElement.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'A imagem deve ter no máximo 5 MB'
      inputElement.value = ''
      return
    }

    this.fileName = file.name
    this.onChange(file)
    const reader = new FileReader()
    reader.onload = () => {
      this.previewUrl = String(reader.result)
      this.imageSelected.emit(this.previewUrl)
    }
    reader.readAsDataURL(file)
  }

  removeImage(event: Event, fileInput: HTMLInputElement): void {
    event.preventDefault()
    event.stopPropagation()
    fileInput.value = ''
    this.fileName = ''
    this.previewUrl = null
    this.errorMessage = ''
    this.onChange(null)
    this.onTouched()
    this.imageSelected.emit(null)
  }

  writeValue(value: File | null): void {
    if (!value) {
      const fileInput = this.fileInput()?.nativeElement
      if (fileInput) fileInput.value = ''
      this.fileName = ''
      this.previewUrl = null
    }
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }
}
