import { OrderStatus } from '../models/order';

export class StatusStyle {
  static orderStatus(status: OrderStatus): string {
    return status.toLowerCase()
  }
}
