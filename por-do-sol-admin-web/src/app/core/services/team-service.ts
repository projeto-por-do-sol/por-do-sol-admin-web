import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Employee } from '../models/employee';
import { EmployeeApiRole, EmployeeCreatedResponse, EmployeeRequest, EmployeeResponse } from '../models/employee-api';
import { KioskSelectionService } from './kiosk-selection-service';
import { KioskService } from './kiosk-service';
import { API_BASE_URL } from '../config/api';

@Injectable({
  providedIn: 'root',
})
export class TeamService {

  private readonly http = inject(HttpClient)
  private readonly kioskService = inject(KioskService)
  private readonly selectionService = inject(KioskSelectionService)
  private readonly _team = signal<Employee[]>([])
  private loading: Promise<void> | null = null

  readonly team = computed(() => {
    const selectedKiosk = this.selectionService.selectedKiosk()

    if (!selectedKiosk) {
      return this._team()
    }

    return this._team().filter(
      (employee) => employee.kioskId === selectedKiosk.id
    )
  })

  loadTeam(): Promise<void> {
    if (this.loading) return this.loading
    this.loading = this.fetchTeam().finally(() => this.loading = null)
    return this.loading
  }

  private async fetchTeam(): Promise<void> {
    await this.kioskService.loadKiosks()
    const kiosks = this.kioskService.kiosks()
    const teams = await Promise.all(kiosks.map(async kiosk => {
      const records = await firstValueFrom(this.http.get<EmployeeResponse[]>(`${API_BASE_URL}/quiosques/${kiosk.id}/funcionarios`))
      return records.map(record => this.mapEmployee(record, kiosk.id!, kiosk.name!))
    }))
    this._team.set(teams.flat())
  }

  getEmployee(id: string): Employee | undefined {
    return this._team().find(employee => employee.id === id)
  }

  async addEmployee(employee: Employee): Promise<EmployeeCreatedResponse> {
    const response = await firstValueFrom(this.http.post<EmployeeCreatedResponse>(
      `${API_BASE_URL}/quiosques/${employee.kioskId}/funcionarios`, this.toRequest(employee)))
    this._team.update(employees => [...employees, {
      ...employee, id: response.id, name: response.nome, status: this.isOnShift(employee.startShift, employee.finishShift),
    }])
    return response
  }

  async updateEmployee(id: string, changes: Employee): Promise<void> {
    const response = await firstValueFrom(this.http.put<EmployeeResponse>(
      `${API_BASE_URL}/quiosques/${changes.kioskId}/funcionarios/${id}`, this.toRequest(changes)))
    const current = this.getEmployee(id)
    this._team.update(employees => employees.map(employee =>
      employee.id === id
        ? { ...this.mapEmployee(response, changes.kioskId!, changes.kioskName!), daysShift: changes.daysShift ?? current?.daysShift }
        : employee
    ))
  }

  async removeEmployee(id: string): Promise<void> {
    const employee = this.getEmployee(id)
    if (!employee) return
    await firstValueFrom(this.http.delete<void>(`${API_BASE_URL}/quiosques/${employee.kioskId}/funcionarios/${id}`))
    this._team.update(employees => employees.filter(item => item.id !== id))
  }

  private toRequest(employee: Employee): EmployeeRequest {
    // A API exige e-mail e senha no DTO, mas ignora ambos.
    return {
      nome: employee.name ?? '',
      email: employee.email ?? '',
      password: crypto.randomUUID().slice(0, 8),
      startShift: employee.startShift ?? '',
      finishShift: employee.finishShift ?? '',
      role: this.toApiRole(employee.role),
      telefone: employee.phone ?? '',
    }
  }

  private toApiRole(role?: string): EmployeeApiRole {
    return role === 'Gerente' ? 'GERENTE' : 'FUNCIONARIO'
  }

  private mapEmployee(record: EmployeeResponse, kioskId: string, kioskName: string): Employee {
    const startShift = record.startShift?.slice(0, 5)
    const finishShift = record.finishShift?.slice(0, 5)
    return {
      id: record.id,
      name: record.nome,
      email: record.email,
      phone: record.telefone ?? '',
      role: record.role?.toUpperCase() === 'GERENTE' ? 'Gerente' : 'Funcionário',
      kioskId, kioskName, startShift, finishShift,
      daysShift: [],
      status: this.isOnShift(startShift, finishShift),
    }
  }

  private isOnShift(start?: string, finish?: string): boolean {
    if (!start || !finish) return false
    const now = new Date()
    const current = now.getHours() * 60 + now.getMinutes()
    const toMinutes = (value: string) => { const [h, m] = value.split(':').map(Number); return h * 60 + m }
    const from = toMinutes(start), to = toMinutes(finish)
    return from <= to ? current >= from && current <= to : current >= from || current <= to
  }

}
