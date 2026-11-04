import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-first-kiosk-card',
  imports: [Button],
  templateUrl: './first-kiosk-card.html',
  styleUrl: './first-kiosk-card.css',
})
export class FirstKioskCard {
  private readonly router = inject(Router)

  goToKioskRegister() {
    this.router.navigate(['kioskRegister'])
  }
}
