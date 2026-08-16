import { Injectable, computed, inject, signal } from '@angular/core';
import { KioskService } from './kiosk-service';

@Injectable({
  providedIn: 'root',
})
export class KioskSelectionService {
  private readonly kioskService = inject(KioskService);
  private readonly _selectedKioskId = signal<string | null>(null);

  readonly selectedKioskId = this._selectedKioskId.asReadonly();

  readonly selectedKiosk = computed(() => {
    const id = this._selectedKioskId();
    if (!id) return null;
    return this.kioskService.kiosks().find((k) => k.id === id) ?? null;
  });

  readonly activeKiosks = computed(() => {
    const selected = this.selectedKiosk();
    return selected ? [selected] : this.kioskService.kiosks();
  });

  selectKiosk(id: string | null) {
    this._selectedKioskId.set(id === '' ? null : id);
  }

  clearSelection() {
    this._selectedKioskId.set(null);
  }

  isAllSelected(): boolean {
    return this._selectedKioskId() === null;
  }
}