import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Button } from '../../shared/ui/button/button';
import { CancelButton } from '../../shared/ui/cancel-button/cancel-button';
import { CardPreview, PreviewItem } from '../../shared/ui/card-preview/card-preview';
import { ImageInput } from '../../shared/ui/image-input/image-input';
import { Input } from '../../shared/ui/input/input';
import { ReturnLink } from '../../shared/ui/return-link/return-link';
import { SectionTitle } from '../../shared/ui/section-title/section-title';
import { UserService } from '../../services/user-service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value
  const confirmation = control.get('passwordConfirmation')?.value
  return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null
}

@Component({
  selector: 'app-owner-registration',
  imports: [ReactiveFormsModule, Input, ImageInput, Button, CancelButton, CardPreview, ReturnLink, SectionTitle],
  templateUrl: './owner-registration.html',
  styleUrl: './owner-registration.css',
})
export class OwnerRegistration {
  private readonly userService = inject(UserService)
  private readonly router = inject(Router)

  readonly imagePreview = signal<string | null>(null)
  readonly isLoading = signal(false)
  readonly errorMessage = signal('')
  readonly formFields = new FormGroup({
    ownerName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    passwordConfirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    profileImage: new FormControl<File | null>(null),
  }, { validators: passwordsMatch })

  private readonly formValue: Signal<typeof this.formFields.value>;
  readonly previewName;
  readonly previewItems;

  constructor() {
    this.formValue = toSignal(this.formFields.valueChanges, { initialValue: this.formFields.value })
    this.previewName = computed(() => this.formValue().ownerName || 'Nome do proprietário')
    this.previewItems = computed<PreviewItem[]>(() => [
      { label: 'E-mail', value: this.formValue().email || 'contato@empresa.com.br' },
      { label: 'Telefone', value: this.formValue().phone || '(00) 00000-0000' },
    ])
  }

  goToLogin(): void {
    this.router.navigate(['/login'])
  }

  onSubmit(): void {
    if (this.formFields.invalid || this.isLoading()) {
      this.formFields.markAllAsTouched()
      return
    }

    const {
      ownerName,
      email,
      phone,
      password,
      profileImage,
    } = this.formFields.getRawValue()

    this.isLoading.set(true)
    this.errorMessage.set('')

    this.userService.registerOwner({
      nome: ownerName,
      email,
      password,
      cpf: null,
      role: 'PROPRIETARIO',
      telefone: phone,
    }, profileImage).subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false)
        this.errorMessage.set(
          error.status === 400
            ? 'Não foi possível cadastrar. Verifique se o e-mail já está em uso.'
            : 'Não foi possível concluir o cadastro. Verifique sua conexão e tente novamente.',
        )
      },
    })
  }
}
