import { Component } from '@angular/core';
import { KioskRegisterForm } from "../../feature/kiosk-register-form/kiosk-register-form";
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { Router } from '@angular/router';
import { ReturnLink } from "../../shared/ui/return-link/return-link";
import { CardPreview } from "../../shared/ui/card-preview/card-preview";

@Component({
  selector: 'app-kiosk-register-page',
  imports: [KioskRegisterForm, SectionTitle, ReturnLink, CardPreview],
  templateUrl: './kiosk-register-page.html',
  styleUrl: './kiosk-register-page.css',
})
export class KioskRegisterPage {

  constructor(private router: Router) { }

  goToHome() {
    this.router.navigate(['/'])
  }

}
