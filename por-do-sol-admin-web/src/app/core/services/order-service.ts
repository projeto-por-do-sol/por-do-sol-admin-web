import { computed, inject, Injectable, signal } from '@angular/core';
import { KioskSelectionService } from './kiosk-selection-service';
import { Order, OrderStatus } from '../models/order';
import { MOCK_ORDERS } from '../mocks/mocks';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private readonly selectionService = inject(KioskSelectionService)
  private readonly _orders = signal<Order[]>(MOCK_ORDERS.map(order => ({ ...order })))

  readonly orders = computed(() => {
    const selectedKiosk = this.selectionService.selectedKiosk()

    if (!selectedKiosk) {
      return this._orders()
    }

    return this._orders().filter((order) => order.kioskId === selectedKiosk.id)
  })

  updateStatus(id: string, status: OrderStatus): void {
    this._orders.update(orders => orders.map(order =>
      order.id === id ? { ...order, status } : order
    ))
  }

}
