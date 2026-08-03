import { Component } from '@angular/core';
import { Input } from "../../shared/ui/input/input";

@Component({
  selector: 'app-kiosk-register-form',
  imports: [Input],
  templateUrl: './kiosk-register-form.html',
  styleUrl: './kiosk-register-form.css',
})
export class KioskRegisterForm {}
