import { Component, input, output } from '@angular/core';
import { nextOrderStatus, OrderStatus, orderStatusLabel } from '../../models/order';

@Component({
  selector: 'app-order-status-actions',
  templateUrl: './order-status-actions.html',
  styleUrl: './order-status-actions.css',
})
export class OrderStatusActions {
  status = input.required<OrderStatus>()
  disabled = input(false)
  statusChange = output<OrderStatus>()

  nextStatus(): OrderStatus | undefined {
    return nextOrderStatus(this.status())
  }

  label(status: OrderStatus): string {
    return orderStatusLabel(status)
  }
}
