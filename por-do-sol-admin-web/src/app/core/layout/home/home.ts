import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { KpiCard } from "../../shared/ui/kpi-card/kpi-card";
import { Header } from "../header/header";
import { CardKioskInfo } from "../../feature/card-kiosk-info/card-kiosk-info";
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { NavigationService } from '../../services/navigation-service';
import { Location } from '@angular/common';
import { StackedColumn } from "../../shared/ui/charts/stacked-column/stacked-column";

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, KpiCard, Header, CardKioskInfo, SectionTitle, StackedColumn],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

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

}
