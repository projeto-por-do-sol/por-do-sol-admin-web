import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from '../../shared/ui/button/button';
import { Input } from '../../shared/ui/input/input';
import { ReturnLink } from '../../shared/ui/return-link/return-link';

@Component({
  selector: 'app-inform-email-for-recovery',
  imports: [ReactiveFormsModule, Input, Button, ReturnLink],
  templateUrl: './inform-email-for-recovery.html',
  styleUrl: './inform-email-for-recovery.css',
})
export class InformEmailForRecovery {
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.router.navigateByUrl('/passwordRecovery');
  }
}
