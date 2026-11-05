import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Order, OrderStatus } from '../models/order';
import { OrderService } from './order-service';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class NewOrderAlertService {

  private readonly orderService = inject(OrderService)
  private readonly userService = inject(UserService)
  private readonly _alerts = signal<ReadonlyMap<string, { status: OrderStatus, seen: boolean }>>(new Map())

  readonly alertOrders = computed<Order[]>(() => {
    const alerts = this._alerts()
    return this.orderService.orders().filter(order => !!order.id && alerts.get(order.id)?.status === order.status)
  })

  readonly hasUnread = computed(() => {
    const alerts = this._alerts()
    return this.alertOrders().some(order => !alerts.get(order.id!)!.seen)
  })

  constructor() {
    effect(() => {
      if (!this.userService.user()) this._alerts.set(new Map())
    })
  }

  async track(orderId: string): Promise<boolean> {
    let order = this.orderService.findOrder(orderId)
    if (!order) {
      await this.orderService.loadOrdersByStatus('CANCELADO').catch(() => undefined)
      order = this.orderService.findOrder(orderId)
    }
    if (!order?.status) return false

    const status = order.status
    this._alerts.update(alerts => {
      const seen = alerts.get(orderId)?.status === status && alerts.get(orderId)!.seen
      return new Map(alerts).set(orderId, { status, seen })
    })
    return true
  }

  markSeen(orders: Order[]): void {
    const seen = new Set(orders.map(order => order.id))
    this._alerts.update(alerts => new Map([...alerts].map(([id, alert]) =>
      [id, seen.has(id) ? { ...alert, seen: true } : alert])))
  }

}
