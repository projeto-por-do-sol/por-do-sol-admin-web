import { Injectable, signal } from '@angular/core';
import { ShoppingCartItem } from '../models/shopping-cart-item';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCart {
  private readonly _shoppingCartItens = signal<ShoppingCartItem[]>([]);
  private nextCartItemId = 0;

  readonly shoppingCartItens = this._shoppingCartItens.asReadonly()

  // addItemToCart(item: ShoppingCartItem): void {
  //   console.log("item add")
  //   const cartItem = {
  //     ...item,
  //     idCartItem: this.nextCartItemId++,
  //   }
  //   this._shoppingCartItens.update(items => [...items, cartItem])
  //   this.showCart()
  // }

  setItemQuantity(idKiosk: string, idItem: string, quantity: number): void {
    this._shoppingCartItens.update(items => {
      const cartItem = items.find(item => item.idKiosk === idKiosk && item.idItem === idItem)

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
    this.showCart()
  }

  // removeItemFromCart(item: ShoppingCartItem): void {
  //   console.log("item remove")
  //   let itemsCart = this._shoppingCartItens()
  //   itemsCart = itemsCart.filter(itemCart => itemCart.idCartItem !== item.idCartItem)

  //   this._shoppingCartItens.set(itemsCart)

  // }

  showCart(){
    console.log(this._shoppingCartItens())
  }
}
