import { Component } from '@angular/core';
import { KpiModel } from '../../../models/kpi-model';

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {

  kpis: KpiModel[] = []

  ngOnInit() {
    this.kpis.push(new KpiModel("Pedidos hoje", "42", "12%", true))
    this.kpis.push(new KpiModel("Faturamento hoje", "R$1.780", "9%", true))
    this.kpis.push(new KpiModel("Ticket médio", "R$ 42", "3%", true))
    this.kpis.push(new KpiModel("Tempo médio", "12 min", "2 min", false))
  }

}
