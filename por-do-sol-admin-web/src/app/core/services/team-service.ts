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

  getEmployee(id: string): Employee | undefined {
    return this._team().find(employee => employee.id === id)
  }

  updateEmployee(id: string, changes: Partial<Employee>): boolean {
    if (!this.getEmployee(id)) return false
    this._team.update(employees => employees.map(employee =>
      employee.id === id ? { ...employee, ...changes, id } : employee
    ))
    return true
  }

  removeEmployee(id: string): boolean {
    if (!this.getEmployee(id)) return false
    this._team.update(employees => employees.filter(employee => employee.id !== id))
    return true
  }

  addEmployee(employee: Employee): void {
    this._team.update(employees => [...employees, { ...employee, id: crypto.randomUUID() }])
  }

}