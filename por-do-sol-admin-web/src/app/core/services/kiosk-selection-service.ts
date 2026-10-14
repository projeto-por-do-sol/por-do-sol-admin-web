import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { KioskService } from './kiosk-service';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class KioskSelectionService {
  private readonly kioskService = inject(KioskService);
  private readonly userService = inject(UserService);
  private readonly _selectedKioskId = signal<string | null>(null)

  readonly selectedKioskId = this._selectedKioskId.asReadonly()

  readonly selectedKiosk = computed(() => {
    const id = this._selectedKioskId();
    if (!id) return null;
    return this.kioskService.kiosks().find((k) => k.id === id) ?? null;
  });

  // readonly activeKiosks = computed(() => {
  //   const selected = this.selectedKiosk();
  //   return selected ? [selected] : this.kioskService.kiosks()
  // });

  constructor() {
    // Ao sair da conta, a seleção do usuário anterior não pode vazar para o próximo login.
    effect(() => {
      if (!this.userService.user()) this._selectedKioskId.set(null)
    })
  }

  selectKiosk(id: string | null) {
    this._selectedKioskId.set(id === '' ? null : id)
  }

  clearSelection() {
    this._selectedKioskId.set(null)
  }

  isAllSelected(): boolean {
    return this._selectedKioskId() === null
  }
}