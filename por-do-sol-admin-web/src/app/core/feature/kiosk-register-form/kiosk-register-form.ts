import { Component } from '@angular/core';
import { Input } from "../../shared/ui/input/input";
import { CancelButton } from "../../shared/ui/cancel-button/cancel-button";
import { Button } from "../../shared/ui/button/button";

@Component({
  selector: 'app-kiosk-register-form',
  imports: [Input, CancelButton, Button],
  templateUrl: './kiosk-register-form.html',
  styleUrl: './kiosk-register-form.css',
})
export class KioskRegisterForm {

  aa(){}

}
