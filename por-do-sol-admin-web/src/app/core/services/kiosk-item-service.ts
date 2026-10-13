import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api';
import { apiImageUrl } from '../utils/api-image-url';
import { CategoryResponse, ItemResponse, AccompanimentResponse } from '../models/item-api';
import { KioskService } from './kiosk-service';
import { KioskItem } from '../models/kiosk-item';
import { KioskSelectionService } from './kiosk-selection-service';

@Injectable({ providedIn: 'root' })
export class KioskItemService {
  private readonly selectionService = inject(KioskSelectionService)
  private readonly _items = signal<KioskItem[]>([])
  readonly allItems = this._items.asReadonly()

  readonly items = computed(() => {
    const selectedKiosk = this.selectionService.selectedKiosk()
    return selectedKiosk
      ? this._items().filter(item => item.kioskId === selectedKiosk.id)
      : this._items()
  })

  private readonly http = inject(HttpClient)
  private readonly kioskService = inject(KioskService)
  readonly categories = signal<Record<string, CategoryResponse[]>>({})
  private loading: Promise<void> | null = null

  loadCatalog(): Promise<void> {
    if (this.loading) return this.loading
    this.loading = this.fetchCatalog().finally(() => this.loading = null)
    return this.loading
  }

  private async fetchCatalog(): Promise<void> {
    await this.kioskService.ensureKiosks()
    const kiosks = this.kioskService.kiosks()
    const catalogs = await Promise.all(kiosks.map(async kiosk => ({
      kiosk, categories: await firstValueFrom(this.http.get<CategoryResponse[]>(`${API_BASE_URL}/quiosques/${kiosk.id}/categorias`)),
    })))
    this.categories.set(Object.fromEntries(catalogs.map(({ kiosk, categories }) => [kiosk.id!, categories])))
    this._items.set(catalogs.flatMap(({ kiosk, categories }) => categories.flatMap(category =>
      category.itens.map(item => this.mapItem(item, kiosk.id!, kiosk.name!, category)),
    )))
  }

  private mapItem(item: ItemResponse, kioskId: string, kioskName: string, category: CategoryResponse): KioskItem {
    return {
      id: String(item.id), kioskId, kioskName, categoryId: category.id_categoria, category: category.nome,
      name: item.nome, description: item.descricao ?? '', value: Number(item.valorPromo ?? item.valorBase),
      baseValue: Number(item.valorBase), promotionalValue: item.valorPromo, order: item.ordem,
      imageUrl: apiImageUrl(item.imagem) || '/assets/images/item-placeholder.svg', ingredients: item.ingredientes.filter(Boolean),
      complements: item.acompanhamentos.map(value => ({ id: value.id, name: value.nome, value: Number(value.valor) })),
    }
  }

  async createCategory(kioskId: string, name: string): Promise<void> {
    const current = this.categories()[kioskId] ?? []
    if (current.some(category => category.nome.toLocaleLowerCase() === name.toLocaleLowerCase())) throw new Error('Categoria já cadastrada.')
    await firstValueFrom(this.http.post(`${API_BASE_URL}/quiosques/${kioskId}/categorias`, {
      nome: name, ordem: Math.max(0, ...current.map(category => category.ordem ?? 0)) + 1,
    }))
    const categories = await firstValueFrom(this.http.get<CategoryResponse[]>(`${API_BASE_URL}/quiosques/${kioskId}/categorias`))
    this.categories.update(value => ({ ...value, [kioskId]: categories }))
  }

  async saveRemote(data: Omit<KioskItem, 'id'>, current?: KioskItem | null): Promise<KioskItem> {
    const category = this.categories()[data.kioskId]?.find(category => category.nome === data.category)
    if (!category) throw new Error('Selecione uma categoria válida.')
    if (current && (current.kioskId !== data.kioskId || current.categoryId !== category.id_categoria)) {
      throw new Error('A API não permite mover um item para outro quiosque ou categoria.')
    }
    const base = `${API_BASE_URL}/quiosques/${data.kioskId}`
    const existing = await firstValueFrom(this.http.get<AccompanimentResponse[]>(`${base}/acompanhamentos`))
    const ids: number[] = []
    for (const complement of data.complements ?? []) {

      let match = existing.find(value => value.nome.trim().toLocaleLowerCase() === complement.name.trim().toLocaleLowerCase() && Number(value.valor) === complement.value)
      if (!match) {
        match = await firstValueFrom(this.http.post<AccompanimentResponse>(`${base}/acompanhamentos`, { nome: complement.name, valor: complement.value }))
        existing.push(match)
      }
      ids.push(match.id)
    }
    const request = {
      nome: data.name, descricao: data.description, ingredientes: data.ingredients ?? [], acompanhamentoIds: ids,
      valorBase: data.value, valorPromo: current?.promotionalValue ?? null,
      ordem: current?.order ?? Math.max(0, ...category.itens.map(item => item.ordem ?? 0)) + 1,
    }
    const url = `${base}/categorias/${category.id_categoria}/itens`
    const response = await firstValueFrom(current
      ? this.http.put<ItemResponse>(`${url}/${current.id}`, request)
      : this.http.post<ItemResponse>(url, request))
    const item = this.mapItem(response, data.kioskId, data.kioskName, category)
    this._items.update(items => [...items.filter(value => value.id !== item.id), item])
    this.categories.update(value => ({ ...value, [data.kioskId]: value[data.kioskId].map(entry => entry.id_categoria === category.id_categoria
      ? { ...entry, itens: [...entry.itens.filter(value => value.id !== response.id), response] } : entry) }))
    return item
  }

  async saveImage(item: KioskItem, image: File | null, remove: boolean): Promise<void> {
    const url = `${API_BASE_URL}/quiosques/${item.kioskId}/categorias/${item.categoryId}/itens/${item.id}/imagem`
    if (image) {
      const form = new FormData()
      form.append('file', image)
      await firstValueFrom(this.http.post(url, form, { responseType: 'text' }))
      const categories = await firstValueFrom(this.http.get<CategoryResponse[]>(`${API_BASE_URL}/quiosques/${item.kioskId}/categorias`))
      const category = categories.find(value => value.id_categoria === item.categoryId)!
      const response = category.itens.find(value => String(value.id) === item.id)!
      this.updateItem(item.id, this.mapItem(response, item.kioskId, item.kioskName, category))
    } else if (remove) {
      await firstValueFrom(this.http.delete(url, { responseType: 'text' }))
      this.updateItem(item.id, { imageUrl: '/assets/images/item-placeholder.svg' })
    }
  }

  async removeRemote(item: KioskItem): Promise<void> {
    await firstValueFrom(this.http.delete(`${API_BASE_URL}/quiosques/${item.kioskId}/categorias/${item.categoryId}/itens/${item.id}`))
    this.removeItem(item.id)
  }

  addItem(item: KioskItem): void {
    this._items.update(items => [...items, item])
  }

  getItem(id: string): KioskItem | undefined {
    return this._items().find(item => item.id === id)
  }

  updateItem(id: string, changes: Partial<KioskItem>): boolean {
    if (!this.getItem(id)) return false
    this._items.update(items => items.map(item =>
      item.id === id ? { ...item, ...changes, id } : item
    ))
    return true
  }

  removeItem(id: string): boolean {
    if (!this.getItem(id)) return false
    this._items.update(items => items.filter(item => item.id !== id))
    return true
  }
}
