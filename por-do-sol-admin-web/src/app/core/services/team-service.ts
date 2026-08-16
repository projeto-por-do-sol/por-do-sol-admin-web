import { computed, inject, Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee';
import { MOCK_EMPLOYEE } from '../mocks/mocks';
import { KioskSelectionService } from './kiosk-selection-service';

@Injectable({
  providedIn: 'root',
})
export class TeamService {

  private readonly selectionService = inject(KioskSelectionService)
  private readonly _team = signal<Employee[]>(MOCK_EMPLOYEE)

  readonly team = computed(() => {
    const selectedKiosk = this.selectionService.selectedKiosk()

    if (!selectedKiosk) {
      return this._team()
    }

    return this._team().filter(
      (employee) => employee.kioskName === selectedKiosk.name
    )
  })

}


