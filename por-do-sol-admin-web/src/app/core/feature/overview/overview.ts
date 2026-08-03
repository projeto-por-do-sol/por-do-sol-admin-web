import { Component } from '@angular/core';
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { KpiCard } from "../../shared/ui/kpi-card/kpi-card";

@Component({
  selector: 'app-overview',
  imports: [SectionTitle, KpiCard],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview {}
