import { Injectable, signal } from '@angular/core';
import { KioskModel } from '../models/kiosk-model';
import { MOCK_KIOSKS } from '../mocks/mocks';

@Injectable({
  providedIn: 'root',
})
export class KioskService {

  private _kiosks = signal<KioskModel[]>(MOCK_KIOSKS)
  kiosks = this._kiosks.asReadonly()

}
