import { Injectable, signal } from '@angular/core';
import { KioskModel } from '../models/kiosk-model';
import { MOCK_KIOSKS } from '../mocks/mocks';

@Injectable({
  providedIn: 'root',
})
export class KioskService {

  private _kiosks = signal<KioskModel[]>(MOCK_KIOSKS)
  kiosks = this._kiosks.asReadonly()

  addCategory(kioskId: string, categoryName: string): boolean {
    const name = categoryName.trim().replace(/\s+/g, ' ')
    const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
    const kiosk = this._kiosks().find(item => item.id === kioskId)
    if (!name || !kiosk || kiosk.categories?.some(category => normalize(category) === normalize(name))) return false

    this._kiosks.update(kiosks => kiosks.map(item => item.id === kioskId
      ? { ...item, categories: [...(item.categories ?? []), name] }
      : item))
    return true
  }

  // ngOnInit() {
  //   this.isOpen()
  // }

  constructor() {
    this.isOpen()
  }

  isOpen() {
    const now = new Date();
    let nowInMinutes = now.getHours() * 60 + now.getMinutes();

    for (const kiosk of this._kiosks()) {
      if (!kiosk.startOperation || !kiosk.finishOperation) {
        continue;
      }

      const [startHour, startMinute] = kiosk.startOperation.split(':').map(Number);
      const [finishHour, finishMinute] = kiosk.finishOperation.split(':').map(Number);

      const startInMinutes = startHour * 60 + startMinute;
      let finishInMinutes = finishHour * 60 + finishMinute;

      let currentMinutes = nowInMinutes;

      if (finishInMinutes <= startInMinutes) {
        finishInMinutes += 24 * 60;

        if (currentMinutes < startInMinutes) {
          currentMinutes += 24 * 60;
        }
      }

      kiosk.isOpen = currentMinutes >= startInMinutes &&
        currentMinutes <= finishInMinutes;

    }
  }
}
