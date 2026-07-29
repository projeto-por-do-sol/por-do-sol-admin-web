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

  constructor(
    private kioskService: KioskService,
  ) { }

  ngOnInit() {
    this.kiosks = this.kioskService.kiosks
  }

  onSelectedOption(option: string) {
    console.log(option);

  }

}
