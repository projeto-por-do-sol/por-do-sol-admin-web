import { Component, input, signal } from '@angular/core';
import { KioskItem } from '../../models/kiosk-item';

@Component({
  selector: 'app-item-card-for-order',
  imports: [],
  templateUrl: './item-card-for-order.html',
  styleUrl: './item-card-for-order.css',
})
export class ItemCardForOrder {
  readonly item = input<KioskItem | null>(null);
  readonly quantity = signal(0);

  decreaseQuantity(): void {
    this.quantity.update(quantity => Math.max(0, quantity - 1));
  }

  increaseQuantity(): void {
    this.quantity.update(quantity => Math.min(99, quantity + 1));
  }

  formatValue(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
}
