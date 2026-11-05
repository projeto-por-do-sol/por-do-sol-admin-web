import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { KioskSelectionService } from './kiosk-selection-service';
import { KioskService } from './kiosk-service';
import { UserService } from './user-service';
import { FINISHED_ORDER_STATUSES, Order, OrderItem, OrderStatus } from '../models/order';
import { OrderItemResponse, OrderResponse, OrderStatusResponse } from '../models/order-api';
import { API_BASE_URL } from '../config/api';
import { KioskModel } from '../models/kiosk-model';

export interface CounterOrderItem {
  itemId: number
  quantity: number
  complementIds: number[]
  removedIngredients: string[]
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private readonly http = inject(HttpClient)
  private readonly kioskService = inject(KioskService)
  private readonly userService = inject(UserService)
  private readonly selectionService = inject(KioskSelectionService)
  private readonly _orders = signal<Order[]>([])
  private readonly _failedKiosks = signal<string[]>([])
  private readonly _lastUpdated = signal<Date | null>(null)
  private readonly _savingIds = signal<ReadonlySet<string>>(new Set())
  private readonly loading = new Map<string, Promise<void>>()
  private session = 0

  readonly failedKiosks = this._failedKiosks.asReadonly()

  readonly lastUpdated = this._lastUpdated.asReadonly()

  readonly savingIds = this._savingIds.asReadonly()

  // Só exibe pedidos de quiosques do usuário logado, mesmo que sobrem pedidos de outra conta em memória.
  readonly orders = computed(() => {
    const selectedKiosk = this.selectionService.selectedKiosk()
    const ownKioskIds = new Set(this.kioskService.kiosks().map(kiosk => kiosk.id))
    const orders = this._orders().filter(order => ownKioskIds.has(order.kioskId))

    if (!selectedKiosk) {
      return orders
    }

    return orders.filter((order) => order.kioskId === selectedKiosk.id)
  })

  constructor() {
    // Ao sair da conta, descarta os pedidos do usuário anterior.
    effect(() => {
      if (this.userService.user()) return
      this._orders.set([])
      this._failedKiosks.set([])
      this._lastUpdated.set(null)
      this.session++
    })
  }

  loadOrders(): Promise<void> {
    return this.load('ativos', kiosk => `${API_BASE_URL}/quiosques/${kiosk.id}/pedidos/ativos`,
      order => !FINISHED_ORDER_STATUSES.includes(order.status!))
  }

  loadOrdersByStatus(status: OrderStatus): Promise<void> {
    return this.load(status, kiosk => `${API_BASE_URL}/quiosques/${kiosk.id}/pedidos?status=${status}`,
      order => order.status === status)
  }

  // Busca sem o filtro de quiosque selecionado, para avisos de qualquer quiosque do usuário.
  findOrder(id: string): Order | undefined {
    const ownKioskIds = new Set(this.kioskService.kiosks().map(kiosk => kiosk.id))
    return this._orders().find(order => order.id === id && ownKioskIds.has(order.kioskId))
  }

  isSaving(order: Order): boolean {
    return !!order.id && this._savingIds().has(order.id)
  }

  async updateStatus(order: Order, status: OrderStatus): Promise<void> {
    if (!order.id) return

    const base = `${API_BASE_URL}/quiosques/${order.kioskId}/pedidos/${order.id}`
    await this.whileSaving(order.id, async () => {

      if (status === 'REJEITADO') {
        const response = await firstValueFrom(this.http.patch<OrderStatusResponse>(`${base}/rejeitar`, null))
        this.setStatus(order.id!, response.status)
      } else {
        const response = await firstValueFrom(this.http.patch<OrderResponse>(base, { status }))
        this.replaceOrder(this.mapOrder(response))
      }
    })
  }

  // A API exige motivo para cancelar pedidos de cliente; nos de balcão ele é opcional.
  async cancelOrder(order: Order, reason: string): Promise<void> {
    if (!order.id) return

    await this.whileSaving(order.id, async () => {
      const response = await firstValueFrom(this.http.post<OrderResponse>(
        `${API_BASE_URL}/quiosques/${order.kioskId}/pedidos/${order.id}/cancelar`, { motivo: reason }))
      this.replaceOrder(this.mapOrder(response))
    })
  }

  // Pedido de balcão: a API o cria já em PREPARANDO e sem pagamento.
  async createCounterOrder(kioskId: string, clientName: string, items: CounterOrderItem[]): Promise<Order> {
    const body = {
      nomeCliente: clientName,
      itens: items.map(item => ({
        itemId: item.itemId,
        quantidade: item.quantity,
        acompanhamentosid: item.complementIds,
        ingredientes: item.removedIngredients,
      })),
    }
    const response = await firstValueFrom(
      this.http.post<OrderResponse>(`${API_BASE_URL}/quiosques/${kioskId}/pedidos/interno`, body))
    const order = this.mapOrder(response)
    this._orders.update(orders => [order, ...orders.filter(item => item.id !== order.id)])
    return order
  }

  private load(key: string, url: (kiosk: KioskModel) => string, inScope: (order: Order) => boolean): Promise<void> {
    const current = this.loading.get(key)
    if (current) return current

    const request = this.fetch(url, inScope).finally(() => this.loading.delete(key))
    this.loading.set(key, request)
    return request
  }

  private async fetch(url: (kiosk: KioskModel) => string, inScope: (order: Order) => boolean): Promise<void> {
    const session = this.session
    await this.kioskService.ensureKiosks()
    const kiosks = this.kioskService.kiosks()

    const results = await Promise.allSettled(kiosks.map(async kiosk => {
      const records = await firstValueFrom(this.http.get<OrderResponse[]>(url(kiosk)))
      return records.map(record => this.mapOrder(record))
    }))

    const loadedKioskIds = new Set<string>()
    const loaded: Order[] = []
    const failed: string[] = []
    results.forEach((result, index) => {
      const kiosk = kiosks[index]
      if (result.status === 'fulfilled') {
        loadedKioskIds.add(kiosk.id!)
        loaded.push(...result.value)
      } else {
        failed.push(kiosk.name ?? kiosk.id!)
      }
    })

    // Logout durante a requisição: a resposta pertence ao usuário anterior.
    if (session !== this.session) return

    this._failedKiosks.set(failed)
    if (kiosks.length && !loadedKioskIds.size) {
      throw new Error('Nenhum quiosque pôde ser carregado')
    }

    this._orders.update(orders => [
      ...orders.filter(order => !(loadedKioskIds.has(order.kioskId!) && inScope(order))
        && !loaded.some(item => item.id === order.id)),
      ...loaded,
    ].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')))
    this._lastUpdated.set(new Date())
  }

  private async whileSaving<T>(id: string, action: () => Promise<T>): Promise<T> {
    this._savingIds.update(ids => new Set(ids).add(id))
    try {
      return await action()
    } finally {
      this._savingIds.update(ids => {
        const next = new Set(ids)
        next.delete(id)
        return next
      })
    }
  }

  private setStatus(id: string, status: OrderStatus): void {
    this._orders.update(orders => orders.map(order =>
      order.id === id ? { ...order, status } : order
    ))
  }

  private replaceOrder(updated: Order): void {
    this._orders.update(orders => orders.map(order => order.id === updated.id ? updated : order))
  }

  private mapOrder(record: OrderResponse): Order {
    return {
      id: record.id,
      kioskId: String(record.id_quiosque),
      kioskName: record.nome_quiosque,
      clientId: String(record.id_cliente),
      clientName: record.nome_cliente,
      items: record.itens.flatMap(item => this.mapItem(item)),
      itemDetails: record.itens.map(item => this.mapItemDetails(item)),
      value: record.valorTotal,
      time: record.dataHoraPedido?.slice(11, 16),
      createdAt: record.dataHoraPedido,
      status: record.status,
      interno: record.interno,
      delivererName: record.nome_entregador ?? undefined,
      subTotal: record.subTotal,
      discount: record.desconto ?? undefined,
      paymentMethod: record.formaPagamento ?? undefined,
      paymentStatus: record.statusPagamento ?? undefined,
      amountPaid: record.valorPagoCliente ?? undefined,
      change: record.valorTroco ?? undefined,
      needsCardMachine: record.precisaMaquininha,
      reason: record.motivo ?? undefined,
      ...this.mapLocation(record),
    }
  }

  // A API devolve 0,0 quando o pedido não tem coordenada (ex.: pedidos de balcão).
  private mapLocation(record: OrderResponse): Pick<Order, 'latitude' | 'longitude'> {
    const { latitudeEntrega: latitude, longitudeEntrega: longitude } = record
    if (record.interno || !latitude || !longitude) return {}
    return { latitude, longitude }
  }

  private mapItemDetails(item: OrderItemResponse): OrderItem {
    return {
      name: item.nome,
      quantity: item.quantidade,
      subTotal: item.subTotal ?? undefined,
      removedIngredients: (item.ingredientes ?? []).map(ingredient => ingredient.trim()).filter(ingredient => ingredient),
      complements: (item.acompanhamentos ?? []).map(complement => ({ name: complement.nome, value: complement.valor ?? undefined })),
    }
  }

  private mapItem(item: OrderItemResponse): string[] {
    const name = item.quantidade > 1 ? `${item.quantidade}x ${item.nome}` : item.nome
    const removed = (item.ingredientes ?? []).filter(ingredient => ingredient.trim()).map(ingredient => `- ${ingredient.trim()}`)
    const complements = (item.acompanhamentos ?? []).map(complement => `+ ${complement.nome}`)
    return [name, ...removed, ...complements]
  }

}
