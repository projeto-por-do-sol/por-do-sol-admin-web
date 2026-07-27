import { Component, Signal } from '@angular/core';
import { KpiModel } from '../../../models/kpi-model';
import { KpiService } from '../../../services/kpi-service';

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {

  kpis!: Signal<KpiModel[]>

  constructor(private kpiService: KpiService){}

  ngOnInit() {
    this.kpis = this.kpiService.kpi
  }

}
