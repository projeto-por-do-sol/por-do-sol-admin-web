import { Component, inject } from '@angular/core';
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

  readonly form = new FormGroup({
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    passwordConfirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  }, { validators: passwordsMatch });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: Enviar a nova senha para a API quando a recuperação estiver integrada.
    this.router.navigateByUrl('/login');
  }
}
