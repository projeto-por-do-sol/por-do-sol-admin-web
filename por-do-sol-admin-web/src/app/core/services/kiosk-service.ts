import { Injectable, signal } from '@angular/core';
import { KioskModel } from '../models/kiosk-model';
import { MOCK_KIOSKS } from '../mocks/mocks';

@Injectable({
  providedIn: 'root',
})
export class KioskService {

  private _kiosks = signal<KioskModel[]>(MOCK_KIOSKS)
  kiosks = this._kiosks.asReadonly()

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
