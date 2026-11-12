import { Component, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { KioskModel } from '../../models/kiosk-model';
import { OrderService } from '../../services/order-service';
import { RATING_VALUES, RatingSummary, summarizeRatings } from '../../utils/rating-summary';

@Component({
  selector: 'app-kiosk-rating-dialog',
  templateUrl: './kiosk-rating-dialog.html',
})
export class KioskRatingDialog {
  private readonly orderService = inject(OrderService)
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog')

  readonly kiosk = input<KioskModel | null>(null)
  readonly closed = output<void>()

  readonly ratingValues = RATING_VALUES
  readonly summary = signal<RatingSummary | null>(null)
  readonly loading = signal(false)
  readonly error = signal(false)

  private request = 0
  private pressedBackdrop = false

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement
      const kiosk = this.kiosk()

      if (kiosk) {
        if (!dialog.open) dialog.showModal()
        this.load(kiosk.id!)
      } else if (dialog.open) {
        dialog.close()
      }
    })
  }

  private async load(kioskId: string): Promise<void> {
    const request = ++this.request
    this.summary.set(null)
    this.error.set(false)
    this.loading.set(true)

    try {
      const ratings = await this.orderService.loadKioskRatings(kioskId)
      if (request === this.request) this.summary.set(summarizeRatings(ratings))
    } catch {
      if (request === this.request) this.error.set(true)
    } finally {
      if (request === this.request) this.loading.set(false)
    }
  }

  close(): void {
    this.dialog().nativeElement.close()
  }

  onDialogMousedown(event: MouseEvent): void {
    this.pressedBackdrop = event.target === event.currentTarget
  }

  onDialogClick(event: MouseEvent): void {
    if (this.pressedBackdrop && event.target === event.currentTarget) {
      this.close()
    }
    this.pressedBackdrop = false
  }

  share(summary: RatingSummary, rating: number): number {
    return summary.total ? (summary.counts[rating] / summary.total) * 100 : 0
  }

  formatAverage(average: number): string {
    return average.toFixed(1).replace('.', ',')
  }

  stars(average: number): number[] {
    return [1, 2, 3, 4, 5].map(star => Math.max(0, Math.min(1, average - (star - 1))))
  }

  reviewsLabel(total: number): string {
    return total === 1 ? '1 avaliação' : `${total} avaliações`
  }
}
