import { OrderStatus, PaymentMethod, PaymentStatus } from './order'

export interface OrderItemResponse {
  nome: string
  quantidade: number
  subTotal?: number | null
  ingredientes?: string[]
  acompanhamentos?: { nome: string, valor?: number | null }[]
}

export interface OrderResponse {
  id: string
  id_quiosque: number
  nome_quiosque: string
  id_cliente: number
  nome_cliente: string
  nome_entregador?: string | null
  subTotal?: number
  desconto?: number | null
  valorTotal: number
  formaPagamento?: PaymentMethod | null
  statusPagamento?: PaymentStatus | null
  valorPagoCliente?: number | null
  valorTroco?: number | null
  precisaMaquininha?: boolean
  dataHoraPedido: string
  itens: OrderItemResponse[]
  latitudeEntrega?: number
  longitudeEntrega?: number
  motivo?: string | null
  status: OrderStatus
  interno: boolean
}

export interface OrderStatusResponse {
  id: string
  status: OrderStatus
}
