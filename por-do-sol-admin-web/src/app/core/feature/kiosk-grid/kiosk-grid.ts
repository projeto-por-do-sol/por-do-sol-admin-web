import { Component, computed, signal } from '@angular/core';
import { Chips } from "../../shared/ui/chips/chips";
import { CardKioskInfo } from "../card-kiosk-info/card-kiosk-info";
import { KioskService } from '../../services/kiosk-service';
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { Router } from '@angular/router';

@Component({
  selector: 'app-kiosk-grid',
  imports: [Chips, CardKioskInfo, SectionTitle],
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
  }
}
