import { Component } from '@angular/core';
import { KioskRegisterForm } from "../../feature/kiosk-register-form/kiosk-register-form";

@Component({
  selector: 'app-kiosk-register-page',
  imports: [KioskRegisterForm],
  templateUrl: './kiosk-register-page.html',
  styleUrl: './kiosk-register-page.css',
})
export class KioskRegisterPage {}
