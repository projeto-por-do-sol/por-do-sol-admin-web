import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Button } from '../../shared/ui/button/button';
import { Input } from '../../shared/ui/input/input';
import { ReturnLink } from '../../shared/ui/return-link/return-link';
import {
  PasswordRecoveryService,
  RecoveryAccountType,
  recoveryErrorMessage,
} from '../../services/password-recovery-service';

@Component({
  selector: 'app-inform-email-for-recovery',
  imports: [ReactiveFormsModule, RouterLink, Input, Button, ReturnLink],
  templateUrl: './inform-email-for-recovery.html',
  styleUrl: './inform-email-for-recovery.css',
})
export class InformEmailForRecovery {
  private readonly router = inject(Router);
  private readonly recovery = inject(PasswordRecoveryService);

  readonly accountType = signal<RecoveryAccountType>('QUIOSQUE');
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly teamEmailSent = signal(false);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  setAccountType(type: RecoveryAccountType): void {
    this.accountType.set(type);
    this.errorMessage.set('');
    this.teamEmailSent.set(false);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.teamEmailSent.set(false);
    const type = this.accountType();

    this.recovery
      .request(this.form.controls.email.value.trim(), type)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          if (type === 'FUNCIONARIO') this.teamEmailSent.set(true);
          else this.router.navigateByUrl('/passwordRecovery');
        },
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set(recoveryErrorMessage(error, 'Não foi possível solicitar a recuperação. Tente novamente.')),
      });
  }
}
