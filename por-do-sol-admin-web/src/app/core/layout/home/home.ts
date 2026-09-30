import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Header } from "../header/header";
import { CardKioskInfo } from "../../feature/card-kiosk-info/card-kiosk-info";
import { NavigationService } from '../../services/navigation-service';
import { KioskGrid } from "../../feature/kiosk-grid/kiosk-grid";
import { Orders } from '../../feature/orders/orders';
import { Team } from "../../feature/team/team";
import { Statistics } from "../../feature/statistics/statistics";
import { Overview } from "../../feature/overview/overview";
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { SectionObserverDirective } from '../../utils/section-observer-directive';
import { KioskItems } from '../../feature/kiosk-items/kiosk-items';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, Header, CardKioskInfo, KioskGrid, Orders, Team, Statistics, Overview, SectionObserverDirective, KioskItems],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly selectionService = inject(KioskSelectionService)

  constructor(private navigation: NavigationService) {}

  // ngAfterViewInit() {
  //   const sections = document.querySelectorAll('section');
  //   const observer = new IntersectionObserver(entries => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         this.navigation.activeSection.set(entry.target.id);
  //       }
  //     });

  //   }, {
  //     rootMargin: '-45% 0px -45% 0px',
  //     threshold: 0
  //   });

  //   sections.forEach(section => observer.observe(section));
  // }

  aa() {
    console.log('aa')
  }

}
