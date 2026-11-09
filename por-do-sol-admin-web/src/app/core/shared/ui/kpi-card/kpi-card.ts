import { Component, Signal, effect, inject, untracked } from '@angular/core';
import { KpiModel } from '../../../models/kpi-model';
import { KioskSelectionService } from '../../../services/kiosk-selection-service';
import { KpiService } from '../../../services/kpi-service';
import { KpiCardSkeleton } from '../kpi-card-skeleton/kpi-card-skeleton';

@Component({
  selector: 'app-kpi-card',
  imports: [KpiCardSkeleton],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {

  kpis!: Signal<KpiModel[]>
  failed!: Signal<boolean>
  loading!: Signal<boolean>

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
    this.loading = this.kpiService.loading
  }

  reload() {
    this.kpiService.loadKpi()
  }

}