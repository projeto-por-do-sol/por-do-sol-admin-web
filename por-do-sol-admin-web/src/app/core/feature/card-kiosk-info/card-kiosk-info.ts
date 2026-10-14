import { Component, computed, inject, input, Signal } from '@angular/core';
import { Router } from '@angular/router';
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

  private readonly router = inject(Router)

  kiosk = input.required<KioskModel>()

  averageTicket = computed(() => {
    const { invoicing = 0, todaysOrders = 0 } = this.kiosk()
    return todaysOrders > 0 ? invoicing / todaysOrders : 0
  })

  constructor(
    // private kioskService: KioskService,
  ) { }

  ngOnInit() {
    // this.kiosk = this.kioskService.kiosk
  }

  editKiosk() {
    this.router.navigate(['kioskRegister', this.kiosk().id])
  }

  getIsOpen() {

  }

}
