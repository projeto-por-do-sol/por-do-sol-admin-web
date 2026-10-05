import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KioskItemRegisterForm } from '../../feature/kiosk-item-register-form/kiosk-item-register-form';
import { KioskItemService } from '../../services/kiosk-item-service';
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
  private readonly route = inject(ActivatedRoute)
  private readonly itemService = inject(KioskItemService)
  readonly itemId = this.route.snapshot.paramMap.get('id')
  readonly item = this.itemId ? this.itemService.getItem(this.itemId) : null

  goToHome(): void {
    this.router.navigate(['/home'])
  }
}
