import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api';
import { StatisticsResponse } from '../models/statistics-model';
import { KioskSelectionService } from './kiosk-selection-service';
import { UserService } from './user-service';

// Janela exibida nos gráficos: hoje e os 6 dias anteriores.
const PERIOD_DAYS = 7

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {

  private readonly http = inject(HttpClient)
  private readonly userService = inject(UserService)
  private readonly selectionService = inject(KioskSelectionService)
  private requestId = 0

  private _statistics = signal<StatisticsResponse | null>(null)
  statistics = this._statistics.asReadonly()

  readonly failed = signal(false)

  // Uma resposta com sucesso sempre traz dados: sem dados e sem erro, ainda está carregando.
  readonly loading = computed(() => !this.failed() && !this._statistics())

  private dataKioskId: string | null = null

  constructor() {
    effect(() => {
      if (this.userService.user()) return
      this._statistics.set(null)
      this.failed.set(false)
    })
  }

  async load(): Promise<void> {
    // Se a seleção mudar durante a requisição, só a resposta mais recente vale.
    const request = ++this.requestId
    this.failed.set(false)

    // Ao trocar de quiosque, não mantém os gráficos do anterior na tela. Atualizar o mesmo quiosque não limpa nada.
    const kioskId = this.selectionService.selectedKioskId()
    if (kioskId !== this.dataKioskId) {
      this._statistics.set(null)
      this.dataKioskId = kioskId
    }

    try {
      const statistics = await firstValueFrom(this.http.get<StatisticsResponse>(`${API_BASE_URL}/empresas/me/statistics`, { params: this.params() }))
      if (request === this.requestId) this._statistics.set(statistics)
    } catch {
      if (request !== this.requestId) return
      this._statistics.set(null)
      this.failed.set(true)
    }
  }

  // Sem quiosque selecionado, a API devolve o total do proprietário ou o quiosque do gerente.
  private params() {
    const end = new Date()
    const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - (PERIOD_DAYS - 1))
    const params: Record<string, string> = { startDate: this.isoDate(start), endDate: this.isoDate(end) }
    const kioskId = this.selectionService.selectedKioskId()
    if (kioskId) params['kioskId'] = kioskId
    return params
  }

  private isoDate(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  }

}
