import { Component, input, output } from '@angular/core';
import { MAX_CART_ITEM_QUANTITY, normalizeCartQuantity } from '../../utils/cart-quantity';

@Component({
  selector: 'app-quantity-selector',
  templateUrl: './quantity-selector.html',
  host: { class: 'inline-block shrink-0' },
})
export class QuantitySelector {
  readonly quantity = input.required<number>()
  readonly itemName = input('item')
  readonly compact = input(false)
  readonly quantityChange = output<number>()
  readonly maxQuantity = MAX_CART_ITEM_QUANTITY

  changeQuantity(difference: number): void {
    const quantity = normalizeCartQuantity(this.quantity() + difference)
    if (quantity !== this.quantity()) this.quantityChange.emit(quantity)
  }
}
