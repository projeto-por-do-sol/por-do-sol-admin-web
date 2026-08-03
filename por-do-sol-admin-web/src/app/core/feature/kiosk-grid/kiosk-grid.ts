import { Component, Signal } from '@angular/core';
import { Chips } from "../../shared/ui/chips/chips";
import { CardKioskInfo } from "../card-kiosk-info/card-kiosk-info";
import { KioskModel } from '../../models/kiosk-model';
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

  kiosks!: Signal<KioskModel[]>
  selectedKiosk: KioskModel[] = []
  chipOptions: string[] = ['Todos', 'Abertos', 'Fechados']
  standardOption: string = this.chipOptions[0]

  constructor(
    private kioskService: KioskService,
    private router: Router
  ) { }

  ngOnInit() {
    this.kiosks = this.kioskService.kiosks
    this.selectedKiosk = this.kiosks()
  }

  goToKioskRegister() {
    this.router.navigate(['kioskRegister'])
  }

  onSelectedOption(option: string) {
    switch (option) {
      case "Abertos":
        this.selectedKiosk = this.kiosks().filter(kiosk => kiosk.isOpen);
        break;

      case "Fechados":
        this.selectedKiosk = this.kiosks().filter(kiosk => !kiosk.isOpen);
        break;

      default:
        this.selectedKiosk = this.kiosks();
    }
  }

  aa() { }

}
