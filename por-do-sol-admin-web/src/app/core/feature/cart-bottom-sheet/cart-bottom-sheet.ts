import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Input } from '../../shared/ui/input/input';
import { Button } from '../../shared/ui/button/button';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { KioskItemService } from '../../services/kiosk-item-service';
import { ShoppingCart } from '../../services/shopping-cart';
import { cartItemUnitPrice } from '../../utils/cart-item-price';

import { HttpErrorResponse } from '@angular/common/http';
import { CounterOrderItem, OrderService } from '../../services/order-service';
import { NotificationService } from '../../services/notification-service';
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
  private readonly orderService = inject(OrderService)
  private readonly notifications = inject(NotificationService)
  private readonly kioskId = inject<{ kioskId: string }>(MAT_BOTTOM_SHEET_DATA).kioskId
  readonly sending = signal(false)
  private readonly kioskItemService = inject(KioskItemService)
  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  readonly clientNameControl = new FormControl(
    this.shoppingCart.clientNames()[this.kioskId] ?? '',
    { nonNullable: true },
  )

  constructor() {
    this.clientNameControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(name => {
      this.shoppingCart.setClientName(this.kioskId, name)
    })
  }

  readonly rows = computed(() => {
    const products = this.kioskItemService.allItems()
    return this.shoppingCart.itemsOf(this.kioskId).map(cartItem => {
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

  async send(): Promise<void> {
    const rows = this.rows()
    if (this.sending() || !rows.length) return

    const items = rows.map(({ cartItem, product }) => {
      const complementIds = (cartItem.complement ?? []).map(name =>
        product?.complements?.find(complement => complement.name === name)?.id)
      const itemId = Number(cartItem.idItem)
      if (!product || !Number.isInteger(itemId) || complementIds.some(id => id == null)) return null
      return {
        itemId,
        quantity: cartItem.quantity,
        complementIds: complementIds as number[],
        removedIngredients: cartItem.removedIngredient ?? [],
      }
    })
    if (items.some(item => item === null)) {
      this.notifications.error('Alguns itens do carrinho não estão mais disponíveis. Remova-os e tente novamente.')
      return
    }

    this.sending.set(true)
    try {
      await this.orderService.createCounterOrder(
        this.kioskId, this.shoppingCart.clientNameOf(this.kioskId), items as CounterOrderItem[])
      this.shoppingCart.clearKiosk(this.kioskId)
      this.notifications.success('Pedido enviado com sucesso.')
      this.close()
    } catch (error) {
      this.notifications.error(this.errorMessage(error))
    } finally {
      this.sending.set(false)
    }
  }

  private errorMessage(error: unknown): string {
    const status = error instanceof HttpErrorResponse ? error.status : null
    if (status === 403) return 'Você não tem permissão para criar pedidos neste quiosque.'
    if (status === 400) return 'O pedido foi recusado pela API. Verifique os itens e tente novamente.'
    return 'Não foi possível enviar o pedido. Tente novamente.'
  }

  close(): void {
    this.bottomSheetRef.dismiss()
  }
}
