import { Component, computed, inject, signal } from '@angular/core';
import { ReturnLink } from '../../shared/ui/return-link/return-link';
import { Select } from '../../shared/ui/select/select';
import { Input } from '../../shared/ui/input/input';
import { ItemCardForOrder } from '../../feature/item-card-for-order/item-card-for-order';
import { KioskService } from '../../services/kiosk-service';
import { KioskItemService } from '../../services/kiosk-item-service';
import { ShoppingCart } from '../../services/shopping-cart';
import { CartBottomSheet } from '../../feature/cart-bottom-sheet/cart-bottom-sheet';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { cartItemUnitPrice } from '../../utils/cart-item-price';
import { KioskItem } from '../../models/kiosk-item';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-order',
  imports: [ReturnLink, Select, Input, ItemCardForOrder, ReactiveFormsModule],
  templateUrl: './create-order.html',
})
export class CreateOrder {
  readonly kioskService = inject(KioskService)
  readonly kioskItemService = inject(KioskItemService)
  readonly shoppingCart = inject(ShoppingCart)
  private readonly bottomSheet = inject(MatBottomSheet)
  readonly searchControl = new FormControl('', { nonNullable: true })
  readonly searchTerm = toSignal(this.searchControl.valueChanges, { initialValue: '' })
  readonly selectedKioskId = signal<string | null>(null)
  readonly selectedKiosk = computed(() => this.kioskService.kiosks()
    .find(kiosk => kiosk.id === this.selectedKioskId()) ?? null)
  readonly selectedItems = computed(() => this.kioskItemService.allItems()
    .filter(item => item.kioskId === this.selectedKioskId()))
  readonly filteredItems = computed(() => {
    const query = this.normalizeSearch(this.searchTerm().trim())
    return this.selectedItems().filter(item => this.normalizeSearch(item.name).includes(query))
  })
  readonly itemsByCategory = computed(() => {
    const items = [...this.filteredItems()].sort((a, b) =>
      a.category.localeCompare(b.category, 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR'))
    const categories = new Map<string, KioskItem[]>()

    for (const item of items) {
      const categoryItems = categories.get(item.category) ?? []
      categoryItems.push(item)
      categories.set(item.category, categoryItems)
    }

    return [...categories].map(([category, categoryItems]) => ({ category, items: categoryItems }))
  })

  readonly kioskNames = computed(() => this.kioskService.kiosks()
    .map(kiosk => kiosk.name)
    .filter((name): name is string => !!name))
  readonly selectedKioskName = computed(() => this.selectedKiosk()?.name ?? '')
  readonly cartSummary = computed(() => {
    const cartItems = this.shoppingCart.shoppingCartItens()
    const products = this.kioskItemService.allItems()

    return cartItems.reduce((summary, cartItem) => {
      const product = products.find(item => item.kioskId === cartItem.idKiosk && item.id === cartItem.idItem)
      return {
        quantity: summary.quantity + cartItem.quantity,
        total: summary.total + cartItemUnitPrice(cartItem, product) * cartItem.quantity,
      }
    }, { quantity: 0, total: 0 })
  })
  readonly currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  formatTotal(value: number): string {
    return this.currencyFormatter.format(value)
  }

  openCart(): void {
    this.bottomSheet.open(CartBottomSheet, {
      ariaLabel: 'Itens do carrinho',
      panelClass: ['w-full', 'max-w-2xl!', 'cart-bottom-sheet-panel'],
    })
  }

  selectKioskByName(name: string): void {
    const kiosk = this.kioskService.kiosks().find(kiosk => kiosk.name === name)
    this.selectedKioskId.set(kiosk?.id ?? null)
  }

  private normalizeSearch(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
  }
}
