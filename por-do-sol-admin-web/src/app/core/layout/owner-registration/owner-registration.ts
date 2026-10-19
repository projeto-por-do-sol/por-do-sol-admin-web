import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../shared/ui/button/button';
import { CancelButton } from '../../shared/ui/cancel-button/cancel-button';
import { CardPreview, PreviewItem } from '../../shared/ui/card-preview/card-preview';
import { ImageInput } from '../../shared/ui/image-input/image-input';
import { Input } from '../../shared/ui/input/input';
import { ReturnLink } from '../../shared/ui/return-link/return-link';
import { SectionTitle } from '../../shared/ui/section-title/section-title';
import { UserService } from '../../services/user-service';
import { NotificationService } from '../../services/notification-service';
import { apiImageUrl } from '../../utils/api-image-url';

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
  private readonly notifications = inject(NotificationService)

  readonly isEditMode = inject(ActivatedRoute).snapshot.data['editMode'] === true
  readonly existingImageUrl = this.isEditMode ? apiImageUrl(this.userService.user()?.image) ?? null : null

  readonly imagePreview = signal<string | null>(this.existingImageUrl)
  readonly imageRemoved = signal(false)
  readonly isLoading = signal(false)
  readonly errorMessage = signal('')
  readonly formFields = new FormGroup({
    ownerName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)] }),
    currentPassword: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    passwordConfirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    profileImage: new FormControl<File | null>(null),
  }, { validators: passwordsMatch })

  private readonly formValue: Signal<typeof this.formFields.value>;
  readonly previewName;
  readonly previewLastText = this.isEditMode
    ? "O card será atualizado no <span class='text-outline'>Painel Administrativo</span> quando as alterações forem salvas."
    : "Esta será a identificação da sua empresa no <span class='text-outline'>Painel Administrativo</span>."
  readonly previewItems;

  constructor() {
    if (this.isEditMode) this.setupEditMode()

    this.formValue = toSignal(this.formFields.valueChanges, { initialValue: this.formFields.value })
    this.previewName = computed(() => this.formValue().ownerName || 'Nome do proprietário')
    this.previewItems = computed<PreviewItem[]>(() => [
      { label: 'E-mail', value: this.formValue().email || 'contato@empresa.com.br' },
      { label: 'Telefone', value: this.formValue().phone || '(00) 00000-0000' },
    ])
  }

  private setupEditMode(): void {
    const user = this.userService.user()
    const { password, passwordConfirmation, currentPassword } = this.formFields.controls

    this.formFields.patchValue({
      ownerName: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    })

    password.setValidators(Validators.minLength(8))
    password.updateValueAndValidity()
    passwordConfirmation.clearValidators()
    passwordConfirmation.updateValueAndValidity()

    password.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      for (const control of [currentPassword, passwordConfirmation]) {
        control.setValidators(value ? Validators.required : null)
        control.updateValueAndValidity({ emitEvent: false })
      }
    })
  }

  onImageSelected(url: string | null): void {
    this.imagePreview.set(url)
    this.imageRemoved.set(url === null)
  }

  onCancel(): void {
    this.router.navigate([this.isEditMode ? '/home' : '/login'])
  }

  onSubmit(): void {
    if (this.formFields.invalid || this.isLoading()) {
      this.formFields.markAllAsTouched()
      return
    }

    if (this.isEditMode) {
      this.updateProfile()
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

  private updateProfile(): void {
    const {
      ownerName,
      email,
      phone,
      currentPassword,
      password,
      profileImage,
    } = this.formFields.getRawValue()

    this.isLoading.set(true)
    this.errorMessage.set('')

    this.userService.updateProfile(
      { nome: ownerName.trim(), email: email.trim(), telefone: phone },
      {
        password: password ? { senhaAtual: currentPassword, novaSenha: password } : undefined,
        image: profileImage,
        removeImage: this.imageRemoved() && !!this.existingImageUrl,
      },
    ).subscribe({
      next: ({ emailChanged }) => {
        if (emailChanged) {
          this.userService.logout()
          this.notifications.success('Perfil atualizado. Entre novamente com o novo e-mail.')
          this.router.navigateByUrl('/login')
          return
        }
        this.notifications.success('Perfil atualizado com sucesso.')
        this.router.navigateByUrl('/home')
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false)

        this.errorMessage.set(
          (error.status === 400 || error.status === 409) && error.error?.message
            ? error.error.message
            : 'Não foi possível salvar as alterações. Verifique sua conexão e tente novamente.',
        )
      },
    })
  }
}
