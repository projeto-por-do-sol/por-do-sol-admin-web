import { Component, output } from '@angular/core';
import { Input } from "../../shared/ui/input/input";
import { CancelButton } from "../../shared/ui/cancel-button/cancel-button";
import { Button } from "../../shared/ui/button/button";
import { ChipMultiChoice } from "../../shared/ui/chip-multi-choice/chip-multi-choice";

@Component({
  selector: 'app-kiosk-register-form',
  imports: [Input, CancelButton, Button, ChipMultiChoice],
  templateUrl: './kiosk-register-form.html',
  styleUrl: './kiosk-register-form.css',
})
export class KioskRegisterForm {

  daysOpen: string[] = []
  onClickCancelButton = output<void>()

  setDaysOpen(days: string[]) {
    this.daysOpen = days
  }

  onClickCancel() {
    this.onClickCancelButton.emit()
  }

  goToHome() {

  }

  aa() {
    console.log(this.daysOpen)
  }

  aa2() { }

}
