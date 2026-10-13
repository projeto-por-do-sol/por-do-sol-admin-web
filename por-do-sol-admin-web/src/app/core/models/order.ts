export const ORDER_STATUSES = [
  'CRIADO',
  'ACEITO',
  'PREPARANDO',
  'EM_ENTREGA',
  'FINALIZADO',
  'AVALIADO',
  'CANCELADO',
  'REJEITADO',
] as const

export type OrderStatus = typeof ORDER_STATUSES[number]

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  CRIADO: 'Esperando confirmação',
  ACEITO: 'Aceito',
  PREPARANDO: 'Preparando',
  EM_ENTREGA: 'Entregando',
  FINALIZADO: 'Finalizado',
  AVALIADO: 'Avaliado',
  CANCELADO: 'Cancelado',
  REJEITADO: 'Recusado',
}

export const FINISHED_ORDER_STATUSES: readonly OrderStatus[] = ['FINALIZADO', 'AVALIADO', 'CANCELADO', 'REJEITADO']

const NEXT_ORDER_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  ACEITO: 'PREPARANDO',
  PREPARANDO: 'EM_ENTREGA',
  EM_ENTREGA: 'FINALIZADO',
}

export function nextOrderStatus(status: OrderStatus): OrderStatus | undefined {
  return NEXT_ORDER_STATUS[status]
}

export function orderStatusLabel(status?: OrderStatus): string {
  return status ? ORDER_STATUS_LABEL[status] : ''
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
  createdAt?: string
  interno?: boolean
  status?: OrderStatus = 'CRIADO'

}
