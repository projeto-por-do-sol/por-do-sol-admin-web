import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Input } from "../../shared/ui/input/input";
import { Button } from "../../shared/ui/button/button";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Input, Button, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly userService = inject(UserService)
  private readonly router = inject(Router)
  readonly isLoading = signal(false)
  readonly errorMessage = signal('')

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rememberMe: new FormControl(false, { nonNullable: true }),
  })

  login(): void {
    if (this.form.invalid || this.isLoading()) {
      this.form.markAllAsTouched();
      return
    }

    const { email, password, rememberMe } = this.form.getRawValue()
    this.isLoading.set(true)
    this.errorMessage.set('')

    this.userService.login({ email, password }, rememberMe).subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.status === 400 || error.status === 401 || error.status === 403
            ? 'Credencial ou senha inválida.'
            : 'Não foi possível entrar. Verifique sua conexão e tente novamente.',
        )
      },
    })
  }
}
