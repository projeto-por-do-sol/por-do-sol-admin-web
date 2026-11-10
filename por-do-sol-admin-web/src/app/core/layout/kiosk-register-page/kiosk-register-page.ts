import { Component, inject, signal } from '@angular/core';
import { KIOSK_FORM_SKELETON, KioskRegisterForm } from "../../feature/kiosk-register-form/kiosk-register-form";
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ReturnLink } from "../../shared/ui/return-link/return-link";
import { CardPreview } from "../../shared/ui/card-preview/card-preview";
import { KioskService } from '../../services/kiosk-service';
import { KioskDetailsResponse } from '../../models/kiosk-registration';
import { FormSkeleton } from '../../shared/ui/form-skeleton/form-skeleton';
import { CardPreviewSkeleton } from '../../shared/ui/card-preview-skeleton/card-preview-skeleton';

@Component({
  selector: 'app-kiosk-register-page',
  imports: [KioskRegisterForm, SectionTitle, ReturnLink, CardPreview, FormSkeleton, CardPreviewSkeleton],
  templateUrl: './kiosk-register-page.html',
  styleUrl: './kiosk-register-page.css',
})
export class KioskRegisterPage {

  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly kioskService = inject(KioskService)

  readonly kioskId = this.route.snapshot.paramMap.get('id')
  readonly kiosk = signal<KioskDetailsResponse | null>(null)
  readonly loading = signal(this.kioskId !== null)
  readonly loadError = signal(false)
  readonly formSkeleton = KIOSK_FORM_SKELETON

  constructor() {
    if (this.kioskId) void this.loadKiosk(this.kioskId)
  }

  async loadKiosk(id: string): Promise<void> {
    this.loading.set(true)
    this.loadError.set(false)
    try {
      await this.kioskService.ensureKiosks()
      this.kiosk.set(await firstValueFrom(this.kioskService.getKioskDetails(id)))
    } catch {
      this.loadError.set(true)
    } finally {
      this.loading.set(false)
    }
  }

  goToHome() {
    this.router.navigate(['/home'])
  }

}
