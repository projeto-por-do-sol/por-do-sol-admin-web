import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Order } from '../../models/order';

@Component({
  selector: 'app-new-orders-dialog',
  imports: [DatePipe],
  templateUrl: './new-orders-dialog.html',
})
export class NewOrdersDialog {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog')

  readonly open = input(false)
  readonly orders = input<Order[]>([])
  readonly showKiosk = input(false)

  readonly closed = output<void>()
  readonly selected = output<Order>()

  private pressedBackdrop = false

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement
      if (this.open()) {
        if (!dialog.open) dialog.showModal()
      } else if (dialog.open) {
        dialog.close()
      }
    })
  }

  close(): void {
    this.dialog().nativeElement.close()
  }

  onDialogMousedown(event: MouseEvent): void {
    this.pressedBackdrop = event.target === event.currentTarget
  }

  onDialogClick(event: MouseEvent): void {
    if (this.pressedBackdrop && event.target === event.currentTarget) this.close()
    this.pressedBackdrop = false
  }

  tag(order: Order): string {
    return order.status === 'CANCELADO' ? 'Cancelado' : 'Novo'
  }

  formatCurrency(value?: number): string {
    return `R$ ${(value ?? 0).toFixed(2).replace('.', ',')}`
  }
}
