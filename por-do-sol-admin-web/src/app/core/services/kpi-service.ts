import { Injectable, signal } from '@angular/core';
import { KpiModel } from '../models/kpi-model';
import { MOCK_KPI } from '../mocks/mocks';

@Injectable({
  providedIn: 'root',
})
export class KpiService {

  private _kpi = signal<KpiModel[]>(MOCK_KPI)
  kpi = this._kpi.asReadonly()

}
