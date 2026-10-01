import { Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Input } from '../../shared/ui/input/input';
import { Button } from '../../shared/ui/button/button';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { KioskItemService } from '../../services/kiosk-item-service';
import { ShoppingCart } from '../../services/shopping-cart';
import { cartItemUnitPrice } from '../../utils/cart-item-price';

import { QuantitySelector } from '../quantity-selector/quantity-selector';

@Component({
  selector: 'app-cart-bottom-sheet',
  imports: [QuantitySelector, Input, Button, ReactiveFormsModule],
  templateUrl: './cart-bottom-sheet.html',
  host: { class: 'block w-full' },
})
export class CartBottomSheet {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CartBottomSheet>)
  private readonly shoppingCart = inject(ShoppingCart)
  private readonly kioskItemService = inject(KioskItemService)
  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  readonly clientNameControl = new FormControl(
    this.shoppingCart.clientName() === 'Balcão' ? '' : this.shoppingCart.clientName(),
    { nonNullable: true },
  )

  constructor() {
    this.clientNameControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(name => {
      this.shoppingCart.setClientName(name)
    })
  }

  readonly rows = computed(() => {
    const products = this.kioskItemService.allItems()
    return this.shoppingCart.shoppingCartItens().map(cartItem => {
      const product = products.find(item => item.kioskId === cartItem.idKiosk && item.id === cartItem.idItem)
      return { cartItem, product, lineTotal: cartItemUnitPrice(cartItem, product) * cartItem.quantity }
    })
  })
  readonly summary = computed(() => this.rows().reduce((total, row) => ({
    quantity: total.quantity + row.cartItem.quantity,
    value: total.value + row.lineTotal,
  }), { quantity: 0, value: 0 }))

  formatCurrency(value: number): string {
    return this.currencyFormatter.format(value)
  }

  setQuantity(item: ShoppingCartItem, quantity: number): void {
    if (item.idCartItem === null) return
    this.shoppingCart.setCartItemQuantity(item.idCartItem, quantity)
  }

  removeItem(item: ShoppingCartItem): void {
    if (item.idCartItem === null) return
    this.shoppingCart.removeItemFromCart(item.idCartItem)
  }

  close(): void {
    this.bottomSheetRef.dismiss()
  }
}
