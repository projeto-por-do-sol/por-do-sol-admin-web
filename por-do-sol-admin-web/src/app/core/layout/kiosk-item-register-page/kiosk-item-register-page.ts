import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KioskItemRegisterForm } from '../../feature/kiosk-item-register-form/kiosk-item-register-form';
import { CardPreview } from '../../shared/ui/card-preview/card-preview';
import { ReturnLink } from '../../shared/ui/return-link/return-link';
import { SectionTitle } from '../../shared/ui/section-title/section-title';

@Component({
  selector: 'app-kiosk-item-register-page',
  imports: [KioskItemRegisterForm, CardPreview, ReturnLink, SectionTitle],
  templateUrl: './kiosk-item-register-page.html',
  styleUrl: './kiosk-item-register-page.css',
})
export class KioskItemRegisterPage {
  private readonly router = inject(Router)

  goToHome(): void {
    this.router.navigate(['/home'])
  }
}
