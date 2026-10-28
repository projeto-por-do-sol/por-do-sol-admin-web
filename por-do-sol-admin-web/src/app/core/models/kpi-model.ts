export class KpiModel {

  lable?: string
  value?: String
  variation?: string
  direction?: boolean
  good?: boolean

  constructor(lable: string, value: string, variation: string, direction: boolean, good?: boolean) {
    this.lable = lable
    this.value = value
    this.variation = variation
    this.direction = direction
    this.good = good
  }

}

export interface KpiSummaryResponse {
  pedidosHoje: number
  varPedidos: number
  faturamentoHoje: number
  varFaturamento: number
  ticketMedio: number
  varTicket: number
  tempoMedio: number
  varTempo: number
  varTempoMinutos?: number
}
