import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Header } from "../header/header";
import { CardKioskInfo } from "../../feature/card-kiosk-info/card-kiosk-info";
import { NavigationService } from '../../services/navigation-service';
import { FirstKioskCard } from '../../feature/first-kiosk-card/first-kiosk-card';
import { KioskGrid } from "../../feature/kiosk-grid/kiosk-grid";
import { Orders } from '../../feature/orders/orders';
import { Team } from "../../feature/team/team";
import { Statistics } from "../../feature/statistics/statistics";
import { Overview } from "../../feature/overview/overview";
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { SectionObserverDirective } from '../../utils/section-observer-directive';
import { KioskItems } from '../../feature/kiosk-items/kiosk-items';
import { KioskService } from '../../services/kiosk-service';
import { PermissionService } from '../../services/permission-service';
import { Skeleton } from '../../shared/ui/skeleton/skeleton';
import { KpiCardSkeleton } from '../../shared/ui/kpi-card-skeleton/kpi-card-skeleton';
import { StatisticsSkeleton } from '../../feature/statistics-skeleton/statistics-skeleton';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, Header, CardKioskInfo, KioskGrid, FirstKioskCard, Orders, Team, Statistics, Overview, SectionObserverDirective, KioskItems, Skeleton, KpiCardSkeleton, StatisticsSkeleton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly kioskService = inject(KioskService)
  readonly selectionService = inject(KioskSelectionService)
  readonly permissions = inject(PermissionService)

  // Proprietário sem nenhum quiosque cadastrado vê apenas a seção "Quiosques".
  // Evita exibir o layout completo antes de saber se o proprietário tem quiosques.
  readonly kiosksLoading = computed(() => this.permissions.isOwner() && !this.kioskService.loaded())

  readonly onlyKiosksSection = computed(() =>
    this.permissions.isOwner() && this.kioskService.loaded() && this.kioskService.kiosks().length === 0)

  readonly kiosksFailed = signal(false)

  ngOnInit() {
    this.loadKiosks()
  }

  loadKiosks() {
    this.kiosksFailed.set(false)
    void this.kioskService.ensureKiosks().catch(() => this.kiosksFailed.set(true))
  }

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
