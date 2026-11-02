import { Component, ElementRef, inject, signal, viewChild, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UserService } from '../../services/user-service';
import { NotificationService } from '../../services/notification-service';
import { Input } from '../../shared/ui/input/input';
import { Button } from '../../shared/ui/button/button';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword')?.value;
  const confirmation = control.get('passwordConfirmation')?.value;
  return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
}

function differsFromCurrent(control: AbstractControl): ValidationErrors | null {
  const current = control.get('currentPassword')?.value;
  const next = control.get('newPassword')?.value;
  return current && next && current === next ? { samePassword: true } : null;
}

/** Modal bloqueante exibido no primeiro login, quando a senha ainda é a provisória. */
@Component({
  selector: 'app-force-password-change-dialog',
  imports: [ReactiveFormsModule, Input, Button],
  templateUrl: './force-password-change-dialog.html',
})
export class ForcePasswordChangeDialog implements AfterViewInit {
  private readonly userService = inject(UserService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly form = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    passwordConfirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  }, { validators: [passwordsMatch, differsFromCurrent] });

  ngAfterViewInit(): void {
    this.dialog().nativeElement.showModal();
  }

  // Esc não pode fechar: a troca é obrigatória.
  blockCancel(event: Event): void {
    event.preventDefault();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isLoading()) return;

    const { currentPassword, newPassword } = this.form.getRawValue();
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService
      .changeTemporaryPassword({ senhaAtual: currentPassword, novaSenha: newPassword })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.dialog().nativeElement.close();
          this.notification.success('Senha alterada com sucesso.');
        },
        error: (error: HttpErrorResponse) => {
          if (error.url?.endsWith('/auth/login/quiosque')) {
            // A senha mudou, mas não foi possível renovar a sessão: pede novo login.
            this.userService.logout();
            this.router.navigateByUrl('/login');
            return;
          }
          this.errorMessage.set(
            error.status === 0
              ? 'Não foi possível conectar à API. Verifique sua conexão e tente novamente.'
              : 'Não foi possível alterar a senha. Confira a senha provisória e tente novamente.',
          );
        },
      });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigateByUrl('/login');
  }
}
