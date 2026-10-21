import { Component, inject, signal } from '@angular/core';
import { CouponRegisterForm } from '../../feature/coupon-register-form/coupon-register-form';
import { CouponList } from '../../feature/coupon-list/coupon-list';
import { SectionTitle } from '../../shared/ui/section-title/section-title';
import { ReturnLink } from '../../shared/ui/return-link/return-link';
import { CouponService } from '../../services/coupon-service';

@Component({
  selector: 'app-coupons-page',
  imports: [CouponRegisterForm, CouponList, SectionTitle, ReturnLink],
  templateUrl: './coupons-page.html',
  styleUrl: './coupons-page.css',
})
export class CouponsPage {

  private readonly couponService = inject(CouponService)

  readonly failedKiosks = this.couponService.failedKiosks
  readonly loading = signal(true)
  readonly loadError = signal(false)

  constructor() {
    void this.loadCoupons()
  }

  async loadCoupons(): Promise<void> {
    this.loading.set(true)
    this.loadError.set(false)
    try {
      await this.couponService.loadCoupons()
    } catch {
      this.loadError.set(true)
    } finally {
      this.loading.set(false)
    }
  }

}
