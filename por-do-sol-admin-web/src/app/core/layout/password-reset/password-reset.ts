import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { PasswordRecoveryService, recoveryErrorMessage } from '../../services/password-recovery-service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from '../../shared/ui/button/button';
import { Input } from '../../shared/ui/input/input';
import { ReturnLink } from '../../shared/ui/return-link/return-link';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmation = control.get('passwordConfirmation')?.value;
  return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule, Input, Button, ReturnLink],
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.css',
})
export class PasswordReset {
  private readonly router = inject(Router);
  private readonly recovery = inject(PasswordRecoveryService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly form = new FormGroup({
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    passwordConfirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  }, { validators: passwordsMatch });

  constructor() {
    if (!this.recovery.hasCode) this.router.navigateByUrl('/informEmailForRecovery');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.recovery
      .reset(this.form.controls.password.value)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.recovery.clear();
          this.router.navigateByUrl('/login');
        },
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set(recoveryErrorMessage(error, 'Código inválido ou expirado. Volte e solicite um novo código.')),
      });
  }
}
