import { Component, computed, inject, signal } from '@angular/core';
import { ReturnLink } from '../../shared/ui/return-link/return-link';
import { Select } from '../../shared/ui/select/select';
import { Input } from '../../shared/ui/input/input';
import { ItemCardForOrder } from '../../feature/item-card-for-order/item-card-for-order';
import { KioskService } from '../../services/kiosk-service';
import { KioskItemService } from '../../services/kiosk-item-service';
import { KioskItem } from '../../models/kiosk-item';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-order',
  imports: [ReturnLink, Select, Input, ItemCardForOrder, ReactiveFormsModule],
  templateUrl: './create-order.html',
  styleUrl: './create-order.css',
})
export class CreateOrder {
  readonly kioskService = inject(KioskService)
  readonly kioskItemService = inject(KioskItemService)
  readonly searchControl = new FormControl('', { nonNullable: true })
  readonly searchTerm = toSignal(this.searchControl.valueChanges, { initialValue: '' })
  readonly selectedKioskId = signal<string | null>(null)
  readonly selectedKiosk = computed(() => this.kioskService.kiosks()
    .find(kiosk => kiosk.id === this.selectedKioskId()) ?? null)
  readonly selectedItems = computed(() => this.kioskItemService.allItems()
    .filter(item => item.kioskId === this.selectedKioskId()))
  readonly filteredItems = computed(() => {
    const query = this.normalizeSearch(this.searchTerm().trim())
    return this.selectedItems().filter(item => this.normalizeSearch(item.name).includes(query))
  })
  readonly itemsByCategory = computed(() => {
    const items = [...this.filteredItems()].sort((a, b) =>
      a.category.localeCompare(b.category, 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR'))
    const categories = new Map<string, KioskItem[]>()

    for (const item of items) {
      const categoryItems = categories.get(item.category) ?? []
      categoryItems.push(item)
      categories.set(item.category, categoryItems)
    }

    return [...categories].map(([category, categoryItems]) => ({ category, items: categoryItems }))
  })

  readonly kioskNames = computed(() => this.kioskService.kiosks()
    .map(kiosk => kiosk.name)
    .filter((name): name is string => !!name))
  readonly selectedKioskName = computed(() => this.selectedKiosk()?.name ?? '')

  selectKioskByName(name: string): void {
    const kiosk = this.kioskService.kiosks().find(kiosk => kiosk.name === name)
    this.selectedKioskId.set(kiosk?.id ?? null)
  }

  private normalizeSearch(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
  }
}
