import { OrderStatus } from './order'

export interface OrderItemResponse {
  nome: string
  quantidade: number
  ingredientes?: string[]
  acompanhamentos?: { nome: string }[]
}

export interface OrderResponse {
  id: string
  id_quiosque: number
  nome_quiosque: string
  id_cliente: number
  nome_cliente: string
  valorTotal: number
  dataHoraPedido: string
  itens: OrderItemResponse[]
  status: OrderStatus
  interno: boolean
}

export interface OrderStatusResponse {
  id: string
  status: OrderStatus
}
