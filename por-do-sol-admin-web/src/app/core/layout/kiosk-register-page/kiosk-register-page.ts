import { Component } from '@angular/core';
import { KioskRegisterForm } from "../../feature/kiosk-register-form/kiosk-register-form";
import { SectionTitle } from "../../shared/ui/section-title/section-title";

@Component({
  selector: 'app-kiosk-register-page',
  imports: [KioskRegisterForm, SectionTitle],
  templateUrl: './kiosk-register-page.html',
  styleUrl: './kiosk-register-page.css',
})
export class KioskRegisterPage {}
