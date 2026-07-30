import { Component, Signal } from '@angular/core';
import { Chips } from "../../shared/ui/chips/chips";
import { CardKioskInfo } from "../card-kiosk-info/card-kiosk-info";
import { KioskModel } from '../../models/kiosk-model';
import { KioskService } from '../../services/kiosk-service';

@Component({
  selector: 'app-kiosk-grid',
  imports: [Chips, CardKioskInfo],
  templateUrl: './kiosk-grid.html',
  styleUrl: './kiosk-grid.css',
})
export class KioskGrid {

  kiosks!: Signal<KioskModel[]>
  selectedKiosk: KioskModel[] = []

  constructor(
    private kioskService: KioskService,
  ) { }

  ngOnInit() {
    this.kiosks = this.kioskService.kiosks
    this.selectedKiosk = this.kiosks()
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

}
