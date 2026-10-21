import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CancelButton } from '../../shared/ui/cancel-button/cancel-button';
import { Coupon } from '../../models/coupon';
import { CouponService, couponErrorMessage } from '../../services/coupon-service';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { NotificationService } from '../../services/notification-service';

type CouponStatus = 'Ativo' | 'Inativo' | 'Expirado'

@Component({
  selector: 'app-coupon-list',
  imports: [CurrencyPipe, DatePipe, DecimalPipe, CancelButton],
  templateUrl: './coupon-list.html',
  styleUrl: './coupon-list.css',
})
export class CouponList {

  private readonly couponService = inject(CouponService)
  private readonly selectionService = inject(KioskSelectionService)
  private readonly notifications = inject(NotificationService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly removeDialog = viewChild<ElementRef<HTMLDialogElement>>('removeDialog')

  readonly selectedKiosk = this.selectionService.selectedKiosk

  readonly coupons = computed(() => {
    const kioskId = this.selectionService.selectedKioskId()
    const coupons = this.couponService.coupons()
    return kioskId ? coupons.filter(coupon => coupon.kioskId === kioskId) : coupons
  })

  readonly showKioskName = computed(() => !this.selectionService.selectedKioskId())
  
  readonly busy = signal<ReadonlySet<string>>(new Set())
  readonly couponToRemove = signal<Coupon | null>(null)

  status(coupon: Coupon): CouponStatus {
    if (this.isExpired(coupon)) return 'Expirado'
    return coupon.ativo ? 'Ativo' : 'Inativo'
  }

  isExpired(coupon: Coupon): boolean {
    return new Date(coupon.dataExpiracao).getTime() <= Date.now()
  }

  isBusy(coupon: Coupon): boolean {
    return this.busy().has(this.key(coupon))
  }

  toggle(coupon: Coupon) {
    if (this.isBusy(coupon) || this.isExpired(coupon)) return
    this.setBusy(coupon, true)

    this.couponService.toggleCoupon(coupon).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.setBusy(coupon, false)),
    ).subscribe({
      error: (error: HttpErrorResponse) =>
        this.notifications.error(couponErrorMessage(error, 'Não foi possível alterar o status do cupom.')),
    })
  }

  openRemoveDialog(coupon: Coupon) {
    this.couponToRemove.set(coupon)
    this.removeDialog()?.nativeElement.showModal()
  }

  closeRemoveDialog() {
    this.removeDialog()?.nativeElement.close()
    this.couponToRemove.set(null)
  }

  confirmRemove() {
    const coupon = this.couponToRemove()
    if (!coupon || this.isBusy(coupon)) return
    this.setBusy(coupon, true)

    this.couponService.deleteCoupon(coupon).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.setBusy(coupon, false)
        this.closeRemoveDialog()
      }),
    ).subscribe({
      next: () => this.notifications.success('Cupom excluído com sucesso.'),
      error: (error: HttpErrorResponse) =>
        this.notifications.error(couponErrorMessage(error, 'Não foi possível excluir o cupom.')),
    })
  }

  private key(coupon: Coupon): string {
    return `${coupon.kioskId}:${coupon.id}`
  }

  private setBusy(coupon: Coupon, busy: boolean) {
    this.busy.update(current => {
      const next = new Set(current)
      if (busy) next.add(this.key(coupon))
      else next.delete(this.key(coupon))
      return next
    })
  }

}
