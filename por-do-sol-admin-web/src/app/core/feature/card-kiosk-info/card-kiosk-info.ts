import { Component, input, Signal } from '@angular/core';
import { KioskModel } from '../../models/kiosk-model';
import { KioskService } from '../../services/kiosk-service';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-card-kiosk-info',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './card-kiosk-info.html',
  styleUrl: './card-kiosk-info.css',
})
export class CardKioskInfo {

  kiosk = input.required<KioskModel>()

  constructor(
    // private kioskService: KioskService,
  ) { }

  ngOnInit() {
    // this.kiosk = this.kioskService.kiosk
  }

  getIsOpen() {

  }

}
