import { Component, computed, inject, input } from '@angular/core';
import { KioskItem } from '../../models/kiosk-item';
import { QuantitySelector } from '../quantity-selector/quantity-selector';
import { ShoppingCart } from '../../services/shopping-cart';

@Component({
  selector: 'app-item-card-for-order',
  imports: [QuantitySelector],
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
      .find(cartItem => cartItem.idKiosk === item.kioskId && cartItem.idItem === item.id &&
        !cartItem.removedIngredient?.length && !cartItem.complement?.length)
      ?.quantity ?? 0
  })

  setQuantity(quantity: number): void {
    const item = this.item()
    if (!item) return

    this.shoppingCart.setItemQuantity(item.kioskId, item.id, quantity)
  }

  formatValue(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }
}
