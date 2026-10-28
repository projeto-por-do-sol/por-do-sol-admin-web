import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config/api';
import { KpiModel, KpiSummaryResponse } from '../models/kpi-model';
import { KioskSelectionService } from './kiosk-selection-service';
import { KioskService } from './kiosk-service';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class KpiService {

  private readonly http = inject(HttpClient)
  private readonly kioskService = inject(KioskService)
  private readonly userService = inject(UserService)
  private readonly selectionService = inject(KioskSelectionService)
  private requestId = 0

  private _kpi = signal<KpiModel[]>([])
  kpi = this._kpi.asReadonly()

  readonly failed = signal(false)

  constructor() {
    effect(() => {
      if (this.userService.user()) return
      this._kpi.set([])
      this.failed.set(false)
    })
  }

  async loadKpi(): Promise<void> {
    // Se a seleção mudar durante a requisição, só a resposta mais recente vale.
    const request = ++this.requestId
    this.failed.set(false)
    try {
      await this.kioskService.ensureKiosks()
      const kpis = this.toKpis(await this.fetchSummary())
      if (request === this.requestId) this._kpi.set(kpis)
    } catch {
      if (request !== this.requestId) return
      this._kpi.set([])
      this.failed.set(true)
    }
  }

  // Com um quiosque selecionado, mostra o dele. Sem seleção, o proprietário recebe o total da empresa
  // e o gerente, que só tem um quiosque, recebe o do próprio quiosque.
  private async fetchSummary(): Promise<KpiSummaryResponse> {
    const selectedId = this.selectionService.selectedKioskId()
    if (!selectedId && this.userService.user()?.role === 'proprietario') {
      return firstValueFrom(this.http.get<KpiSummaryResponse>(`${API_BASE_URL}/empresas/me/overview/resumo`))
    }
    const id = selectedId ?? this.kioskService.kiosks()[0]?.id
    const overview = await firstValueFrom(this.http.get<{ quiosques: KpiSummaryResponse[] }>(`${API_BASE_URL}/quiosques/${id}/overview`))
    return overview.quiosques[0]
  }

  private toKpis(summary: KpiSummaryResponse): KpiModel[] {
    const percent = (value: number) => `${Math.abs(Math.round(value))}%`
    const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    const variation = (value: number, text: string, lowerIsBetter = false) =>
      [text, value >= 0, lowerIsBetter ? value <= 0 : value >= 0] as const

    const kpi = (lable: string, value: string, [text, direction, good]: readonly [string, boolean, boolean]) =>
      new KpiModel(lable, value, text, direction, good)

    const timeVariation = summary.varTempoMinutos != null
      ? variation(summary.varTempoMinutos, `${Math.abs(Math.round(summary.varTempoMinutos))} min`, true)
      : variation(summary.varTempo, percent(summary.varTempo), true)

    return [
      kpi('Pedidos hoje', String(summary.pedidosHoje), variation(summary.varPedidos, percent(summary.varPedidos))),
      kpi('Faturamento hoje', money(summary.faturamentoHoje), variation(summary.varFaturamento, percent(summary.varFaturamento))),
      kpi('Ticket médio', money(summary.ticketMedio), variation(summary.varTicket, percent(summary.varTicket))),
      kpi('Tempo médio', `${Math.round(summary.tempoMedio)} min`, timeVariation),
    ]
  }

}