import { Component, effect, inject, untracked } from '@angular/core';
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { StackedColumn } from "../../shared/ui/charts/stacked-column/stacked-column";
import { Donut } from "../../shared/ui/charts/donut/donut";
import { ZoomableTimeseries } from "../../shared/ui/charts/zoomable-timeseries/zoomable-timeseries";
import { RadialBar } from "../../shared/ui/charts/radial-bar/radial-bar";
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { StatisticsService } from '../../services/statistics-service';
import { StatisticsSkeleton } from '../statistics-skeleton/statistics-skeleton';

@Component({
  selector: 'app-statistics',
  imports: [SectionTitle, StackedColumn, Donut, ZoomableTimeseries, RadialBar, StatisticsSkeleton],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics {

  private readonly statisticsService = inject(StatisticsService)
  private readonly selectionService = inject(KioskSelectionService)

  readonly failed = this.statisticsService.failed
  readonly loading = this.statisticsService.loading

  constructor() {
    effect(() => {
      this.selectionService.selectedKioskId()
      untracked(() => this.reload())
    })
  }

  reload() {
    this.statisticsService.load()
  }

}
