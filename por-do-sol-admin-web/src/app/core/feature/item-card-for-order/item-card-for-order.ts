import { Component, computed, inject, input, signal } from '@angular/core';
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
  readonly removedIngredients = signal<string[]>([])
  readonly selectedComplements = signal<string[]>([])
  readonly quantity = computed(() => {
    const item = this.item()
    if (!item) return 0

    return this.shoppingCart.shoppingCartItens()
      .find(cartItem => cartItem.idKiosk === item.kioskId && cartItem.idItem === item.id &&
        this.sameSelection(cartItem.removedIngredient, this.removedIngredients()) &&
        this.sameSelection(cartItem.complement, this.selectedComplements()))
      ?.quantity ?? 0
  })

  setQuantity(quantity: number): void {
    const item = this.item()
    if (!item) return

    const cartItem = this.shoppingCart.shoppingCartItens().find(cartItem =>
      cartItem.idKiosk === item.kioskId && cartItem.idItem === item.id &&
      this.sameSelection(cartItem.removedIngredient, this.removedIngredients()) &&
      this.sameSelection(cartItem.complement, this.selectedComplements()))

    if (cartItem?.idCartItem != null) {
      this.shoppingCart.setCartItemQuantity(cartItem.idCartItem, quantity)
    } else if (quantity > 0) {
      this.shoppingCart.addItemToCart({
        idCartItem: null,
        idKiosk: item.kioskId,
        idItem: item.id,
        quantity,
        removedIngredient: [...this.removedIngredients()],
        complement: [...this.selectedComplements()],
      })
    }
  }

  toggleIngredient(name: string, checked: boolean): void {
    this.removedIngredients.update(names => checked ? [...names, name] : names.filter(value => value !== name))
  }

  toggleComplement(name: string, checked: boolean): void {
    this.selectedComplements.update(names => checked ? [...names, name] : names.filter(value => value !== name))
  }

  private sameSelection(first: string[] | undefined, second: string[]): boolean {
    return (first?.length ?? 0) === second.length && second.every(name => first?.includes(name))
  }

  formatValue(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }
}
