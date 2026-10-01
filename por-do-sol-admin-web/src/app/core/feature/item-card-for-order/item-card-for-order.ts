import { Component, computed, inject, input } from '@angular/core';
import { KioskItem } from '../../models/kiosk-item';
import { ShoppingCart } from '../../services/shopping-cart';

@Component({
  selector: 'app-item-card-for-order',
  imports: [],
  templateUrl: './item-card-for-order.html',
  styleUrl: './item-card-for-order.css',
})
export class ItemCardForOrder {
  private readonly shoppingCart = inject(ShoppingCart)
  readonly item = input<KioskItem | null>(null)
  readonly quantity = computed(() => {
    const item = this.item()
    if (!item) return 0

    return this.shoppingCart.shoppingCartItens()
      .find(cartItem => cartItem.idKiosk === item.kioskId && cartItem.idItem === item.id)
      ?.quantity ?? 0
  })

  decreaseQuantity(): void {
    const item = this.item()
    if (!item) return

    this.shoppingCart.setItemQuantity(item.kioskId, item.id, Math.max(0, this.quantity() - 1))
  }

  increaseQuantity(): void {
    const item = this.item()
    if (!item) return

    this.shoppingCart.setItemQuantity(item.kioskId, item.id, Math.min(99, this.quantity() + 1))
  }

  formatValue(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }
}
