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

export type PaymentMethod = 'DINHEIRO' | 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO'

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  DINHEIRO: 'Dinheiro',
  PIX: 'Pix',
  CARTAO_CREDITO: 'Cartão de crédito',
  CARTAO_DEBITO: 'Cartão de débito',
}

export type PaymentStatus = 'PENDENTE' | 'PAGO' | 'RECUSADO' | 'CANCELADO'

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDENTE: 'Pendente',
  PAGO: 'Pago',
  RECUSADO: 'Recusado',
  CANCELADO: 'Cancelado',
}

export const FINISHED_ORDER_STATUSES: readonly OrderStatus[] = ['FINALIZADO', 'AVALIADO', 'CANCELADO', 'REJEITADO']

export function nextOrderStatus(status: OrderStatus, interno = false): OrderStatus | undefined {
  if (status === 'ACEITO') return 'PREPARANDO'
  if (interno && (status === 'PREPARANDO' || status === 'EM_ENTREGA')) return 'FINALIZADO'
  return undefined
}

export function orderStatusLabel(status?: OrderStatus): string {
  return status ? ORDER_STATUS_LABEL[status] : ''
}

export interface OrderItem {
  name: string
  quantity: number
  subTotal?: number
  removedIngredients: string[]
  complements: { name: string, value?: number }[]
}

export class Order {

  id?: string
  kioskName?: string
  kioskId?: string
  clientName?: string
  clientId?: string
  items?: string[]
  itemDetails?: OrderItem[]
  value?: number
  time?: string
  createdAt?: string
  interno?: boolean
  status?: OrderStatus = 'CRIADO'
  delivererName?: string
  subTotal?: number
  discount?: number
  paymentMethod?: PaymentMethod
  paymentStatus?: PaymentStatus
  amountPaid?: number
  change?: number
  needsCardMachine?: boolean
  reason?: string
  latitude?: number
  longitude?: number

}
