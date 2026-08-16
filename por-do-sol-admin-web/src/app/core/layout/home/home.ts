import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { KpiCard } from "../../shared/ui/kpi-card/kpi-card";
import { Header } from "../header/header";
import { CardKioskInfo } from "../../feature/card-kiosk-info/card-kiosk-info";
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { NavigationService } from '../../services/navigation-service';
import { Location } from '@angular/common';
import { StackedColumn } from "../../shared/ui/charts/stacked-column/stacked-column";
import { ZoomableTimeseries } from "../../shared/ui/charts/zoomable-timeseries/zoomable-timeseries";
import { Donut } from "../../shared/ui/charts/donut/donut";
import { RadialBar } from "../../shared/ui/charts/radial-bar/radial-bar";
import { KioskGrid } from "../../feature/kiosk-grid/kiosk-grid";
import { Table } from "../../shared/ui/table/table";
import { Orders } from '../../feature/orders/orders';
import { Team } from "../../feature/team/team";
import { Statistics } from "../../feature/statistics/statistics";
import { Overview } from "../../feature/overview/overview";
import { KioskSelectionService } from '../../services/kiosk-selection-service';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, KpiCard, Header, CardKioskInfo, SectionTitle, StackedColumn, ZoomableTimeseries, Donut, RadialBar, KioskGrid, Table, Orders, Team, Statistics, Overview],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly selectionService = inject(KioskSelectionService)

  constructor(private navigation: NavigationService, private location: Location) { }

  ngOnInit() {
    this.location.replaceState('/')
  }

  ngAfterViewInit() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.navigation.activeSection.set(entry.target.id);
        }
      });

    }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }

  aa() {
    console.log('aa')
  }

}
