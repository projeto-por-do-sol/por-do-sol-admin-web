import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KIOSK_ITEM_FORM_SKELETON, KioskItemRegisterForm } from '../../feature/kiosk-item-register-form/kiosk-item-register-form';
import { KioskItemService } from '../../services/kiosk-item-service';
import { CardPreview } from '../../shared/ui/card-preview/card-preview';
import { CardPreviewSkeleton } from '../../shared/ui/card-preview-skeleton/card-preview-skeleton';
import { FormSkeleton } from '../../shared/ui/form-skeleton/form-skeleton';
import { ReturnLink } from '../../shared/ui/return-link/return-link';
import { SectionTitle } from '../../shared/ui/section-title/section-title';

@Component({
  selector: 'app-kiosk-item-register-page',
  imports: [KioskItemRegisterForm, CardPreview, ReturnLink, SectionTitle, FormSkeleton, CardPreviewSkeleton],
  templateUrl: './kiosk-item-register-page.html',
  styleUrl: './kiosk-item-register-page.css',
})
export class KioskItemRegisterPage {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly itemService = inject(KioskItemService)
  readonly itemId = this.route.snapshot.paramMap.get('id')
  readonly item = computed(() => {
    this.itemService.allItems()
    return this.itemId ? this.itemService.getItem(this.itemId) : null
  })
  readonly loading = signal(!!this.itemId)
  readonly loadError = signal(false)
  readonly formSkeleton = KIOSK_ITEM_FORM_SKELETON
  constructor() { if (this.itemId) void this.loadItem() }
  async loadItem(): Promise<void> {
    this.loading.set(true)
    this.loadError.set(false)
    try { await this.itemService.loadCatalog() }
    catch { this.loadError.set(true) }
    finally { this.loading.set(false) }
  }

  goToHome(): void {
    this.router.navigate(['/home'])
  }
}
