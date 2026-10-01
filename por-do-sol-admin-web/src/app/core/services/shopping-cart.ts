import { Injectable, signal } from '@angular/core';
import { ShoppingCartItem } from '../models/shopping-cart-item';

import { normalizeCartQuantity } from '../utils/cart-quantity';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCart {
  private readonly _shoppingCartItens = signal<ShoppingCartItem[]>([]);
  private nextCartItemId = 0;
  private readonly _clientName = signal('Balcão')
  readonly clientName = this._clientName.asReadonly()

  setClientName(name: string): void {
    this._clientName.set(name.trim() || 'Balcão')
  }

  readonly shoppingCartItens = this._shoppingCartItens.asReadonly()

  addItemToCart(item: ShoppingCartItem): void {
    const quantity = normalizeCartQuantity(item.quantity)
    if (quantity === 0) return
    this._shoppingCartItens.update(items => [...items, {
      ...item,
      quantity,
      idCartItem: this.nextCartItemId++,
    }])
  }

  setItemQuantity(idKiosk: string, idItem: string, quantity: number): void {
    quantity = normalizeCartQuantity(quantity)
    this._shoppingCartItens.update(items => {
      const cartItem = items.find(item =>
        item.idKiosk === idKiosk && item.idItem === idItem &&
        !item.removedIngredient?.length && !item.complement?.length)

      if (quantity <= 0) {
        return cartItem ? items.filter(item => item.idCartItem !== cartItem.idCartItem) : items
      }

      if (cartItem) {
        return items.map(item => item.idCartItem === cartItem.idCartItem
          ? { ...item, quantity }
          : item)
      }

      return [...items, {
        idCartItem: this.nextCartItemId++,
        idKiosk,
        idItem,
        quantity,
      }]
    })
  }

  setCartItemQuantity(idCartItem: number, quantity: number): void {
    const nextQuantity = normalizeCartQuantity(quantity)
    this._shoppingCartItens.update(items => nextQuantity === 0
      ? items.filter(item => item.idCartItem !== idCartItem)
      : items.map(item => item.idCartItem === idCartItem
        ? { ...item, quantity: nextQuantity }
        : item))
  }

  removeItemFromCart(idCartItem: number): void {
    this._shoppingCartItens.update(items => items.filter(item => item.idCartItem !== idCartItem))
  }
}
