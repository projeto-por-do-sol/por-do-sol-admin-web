export const ORDER_STATUSES = [
  'Esperando confirmação',
  'Aceito',
  'Preparando',
  'Entregando',
  'Atrasado',
  'Finalizado',
  'Cancelado',
] as const

export type OrderStatus = typeof ORDER_STATUSES[number]

const NEXT_ORDER_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  Aceito: 'Preparando',
  Preparando: 'Entregando',
  Entregando: 'Finalizado',
}

export function nextOrderStatus(status: OrderStatus): OrderStatus | undefined {
  return NEXT_ORDER_STATUS[status]
}

export class Order {

  id?: string
  kioskName?: string
  kioskId?: string
  clientName?: string
  clientId?: string
  items?: string[]
  value?: number
  time?: string
  status?: OrderStatus = 'Esperando confirmação'

}
