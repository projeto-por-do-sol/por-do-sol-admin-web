import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { KioskSelectionService } from './kiosk-selection-service';
import { KioskService } from './kiosk-service';
import { UserService } from './user-service';
import { FINISHED_ORDER_STATUSES, Order, OrderStatus } from '../models/order';
import { OrderItemResponse, OrderResponse, OrderStatusResponse } from '../models/order-api';
import { API_BASE_URL } from '../config/api';
import { KioskModel } from '../models/kiosk-model';

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

  async finishWithCode(order: Order, code: string): Promise<boolean> {
    if (!order.id) return false

    return this.whileSaving(order.id, async () => {
      const valid = await firstValueFrom(this.http.post<boolean>(
        `${API_BASE_URL}/quiosques/${order.kioskId}/pedidos/${order.id}/validar-codigo`, { codigo: code }))
      if (valid) this.setStatus(order.id!, 'FINALIZADO')
      return valid
    })
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
      value: record.valorTotal,
      time: record.dataHoraPedido?.slice(11, 16),
      createdAt: record.dataHoraPedido,
      status: record.status,
      interno: record.interno,
    }
  }

  private mapItem(item: OrderItemResponse): string[] {
    const name = item.quantidade > 1 ? `${item.quantidade}x ${item.nome}` : item.nome
    const removed = (item.ingredientes ?? []).filter(ingredient => ingredient.trim()).map(ingredient => `- ${ingredient.trim()}`)
    const complements = (item.acompanhamentos ?? []).map(complement => `+ ${complement.nome}`)
    return [name, ...removed, ...complements]
  }

}
