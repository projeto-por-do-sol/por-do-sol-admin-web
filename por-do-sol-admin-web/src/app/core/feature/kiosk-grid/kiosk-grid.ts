import { Component, computed, signal } from '@angular/core';
import { Chips } from "../../shared/ui/chips/chips";
import { CardKioskInfo } from "../card-kiosk-info/card-kiosk-info";
import { KioskService } from '../../services/kiosk-service';
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-kiosk-grid',
  imports: [Chips, CardKioskInfo, SectionTitle, MatPaginatorModule],
  templateUrl: './kiosk-grid.html',
  styleUrl: './kiosk-grid.css',
})
export class KioskGrid {

  readonly selectedOption = signal('Todos')
  readonly selectedKiosk = computed(() => {
    const kiosks = this.kioskService.kiosks()
    switch (this.selectedOption()) {
      case 'Abertos': return kiosks.filter(kiosk => kiosk.isOpen)
      case 'Fechados': return kiosks.filter(kiosk => !kiosk.isOpen)
      default: return kiosks
    }
  })
  readonly pageSize = signal(4)
  readonly pageSizeOptions = [4, 8, 12]
  readonly pageIndex = signal(0)
  readonly pagedKiosks = computed(() => {
    const kiosks = this.selectedKiosk()
    const lastPage = Math.max(0, Math.ceil(kiosks.length / this.pageSize()) - 1)
    const start = Math.min(this.pageIndex(), lastPage) * this.pageSize()
    return kiosks.slice(start, start + this.pageSize())
  })
  readonly currentPageIndex = computed(() =>
    Math.min(this.pageIndex(), Math.max(0, Math.ceil(this.selectedKiosk().length / this.pageSize()) - 1)))
  chipOptions: string[] = ['Todos', 'Abertos', 'Fechados']
  standardOption: string = this.chipOptions[0]

  constructor(
    private kioskService: KioskService,
    private router: Router
  ) { }

  goToKioskRegister() {
    this.router.navigate(['kioskRegister'])
  }

  onSelectedOption(option: string) {
    this.selectedOption.set(option)
    this.pageIndex.set(0)
  }

  onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize)
    this.pageIndex.set(event.pageIndex)
  }
}
