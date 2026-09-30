import { Component, computed, inject, signal } from '@angular/core';
import { ReturnLink } from '../../shared/ui/return-link/return-link';
import { Select } from '../../shared/ui/select/select';
import { ItemCardForOrder } from '../../feature/item-card-for-order/item-card-for-order';
import { KioskService } from '../../services/kiosk-service';
import { KioskItemService } from '../../services/kiosk-item-service';

@Component({
  selector: 'app-create-order',
  imports: [ReturnLink, Select, ItemCardForOrder],
  templateUrl: './create-order.html',
  styleUrl: './create-order.css',
})
export class CreateOrder {
  readonly kioskService = inject(KioskService);
  readonly kioskItemService = inject(KioskItemService);
  readonly selectedKioskId = signal<string | null>(null);
  readonly selectedKiosk = computed(() => this.kioskService.kiosks()
    .find(kiosk => kiosk.id === this.selectedKioskId()) ?? null);
  readonly selectedItems = computed(() => this.kioskItemService.allItems()
    .filter(item => item.kioskId === this.selectedKioskId()));

  readonly kioskNames = computed(() => this.kioskService.kiosks()
    .map(kiosk => kiosk.name)
    .filter((name): name is string => !!name));
  readonly selectedKioskName = computed(() => this.selectedKiosk()?.name ?? '');

  selectKioskByName(name: string): void {
    const kiosk = this.kioskService.kiosks().find(kiosk => kiosk.name === name);
    this.selectedKioskId.set(kiosk?.id ?? null);
  }
}
