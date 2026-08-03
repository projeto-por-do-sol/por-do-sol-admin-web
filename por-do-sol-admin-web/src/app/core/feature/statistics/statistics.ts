import { Component } from '@angular/core';
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { StackedColumn } from "../../shared/ui/charts/stacked-column/stacked-column";
import { Donut } from "../../shared/ui/charts/donut/donut";
import { ZoomableTimeseries } from "../../shared/ui/charts/zoomable-timeseries/zoomable-timeseries";
import { RadialBar } from "../../shared/ui/charts/radial-bar/radial-bar";

@Component({
  selector: 'app-statistics',
  imports: [SectionTitle, StackedColumn, Donut, ZoomableTimeseries, RadialBar],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics {}
