import { Component, Signal, effect, inject, untracked } from '@angular/core';
import { KpiModel } from '../../../models/kpi-model';
import { KioskSelectionService } from '../../../services/kiosk-selection-service';
import { KpiService } from '../../../services/kpi-service';

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {

  kpis!: Signal<KpiModel[]>
  failed!: Signal<boolean>

  private readonly selectionService = inject(KioskSelectionService)

  constructor(private kpiService: KpiService){
    effect(() => {
      this.selectionService.selectedKioskId()
      untracked(() => this.reload())
    })
  }

  ngOnInit() {
    this.kpis = this.kpiService.kpi
    this.failed = this.kpiService.failed
  }

  reload() {
    this.kpiService.loadKpi()
  }

}