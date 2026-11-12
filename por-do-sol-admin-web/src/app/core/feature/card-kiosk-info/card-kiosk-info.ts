import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KioskModel } from '../../models/kiosk-model';
import { KioskService } from '../../services/kiosk-service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { PermissionService } from '../../services/permission-service';
import { ApiImagePipe } from '../../shared/pipes/api-image-pipe';
import { AsyncPipe } from '@angular/common';
import { KioskRatingDialog } from '../kiosk-rating-dialog/kiosk-rating-dialog';

@Component({
  selector: 'app-card-kiosk-info',
  imports: [CurrencyPipe, NgClass, ApiImagePipe, AsyncPipe, KioskRatingDialog],
  templateUrl: './card-kiosk-info.html',
  styleUrl: './card-kiosk-info.css',
})
export class CardKioskInfo {

  private readonly router = inject(Router)
  readonly permissions = inject(PermissionService)

  kiosk = input.required<KioskModel>()
  readonly ratingKiosk = signal<KioskModel | null>(null)

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
