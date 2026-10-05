import { computed, inject, Injectable, signal } from '@angular/core';
import { MOCK_KIOSK_ITEMS } from '../mocks/mocks';
import { KioskItem } from '../models/kiosk-item';
import { KioskSelectionService } from './kiosk-selection-service';

@Injectable({ providedIn: 'root' })
export class KioskItemService {
  private readonly selectionService = inject(KioskSelectionService)
  private readonly _items = signal<KioskItem[]>(MOCK_KIOSK_ITEMS)
  readonly allItems = this._items.asReadonly()

  readonly items = computed(() => {
    const selectedKiosk = this.selectionService.selectedKiosk()
    return selectedKiosk
      ? this._items().filter(item => item.kioskId === selectedKiosk.id)
      : this._items()
  })

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
