import { Injectable, signal } from '@angular/core';
import { KioskModel } from '../models/kiosk-model';
import { MOCK_KIOSK } from '../mocks/mocks';

@Injectable({
  providedIn: 'root',
})
export class KioskService {

  private _kiosk = signal<KioskModel>(MOCK_KIOSK)
  kiosk = this._kiosk.asReadonly()

}
