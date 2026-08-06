import { Component, output } from '@angular/core';
import { Input } from "../../shared/ui/input/input";
import { CancelButton } from "../../shared/ui/cancel-button/cancel-button";
import { Button } from "../../shared/ui/button/button";
import { ChipMultiChoice } from "../../shared/ui/chip-multi-choice/chip-multi-choice";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-kiosk-register-form',
  imports: [Input, CancelButton, Button, ChipMultiChoice, ReactiveFormsModule],
  templateUrl: './kiosk-register-form.html',
  styleUrl: './kiosk-register-form.css',
})
export class KioskRegisterForm {

  daysOpen: string[] = []
  onClickCancelButton = output<void>()

  formFields: FormGroup

  constructor() {
    this.formFields = new FormGroup({
      kioskName: new FormControl("", Validators.required),
      kioskEmail: new FormControl("", [Validators.required, Validators.email]),
      kioskPhone: new FormControl("", Validators.required),
      kioskCep: new FormControl("", Validators.required),
      kioskState: new FormControl("", Validators.required),
      kioskCity: new FormControl("", Validators.required),
      kioskStreet: new FormControl(""),
      kioskNumber: new FormControl(""),
      kioskReference: new FormControl(""),
      openTime: new FormControl("08:00", Validators.required),
      closeTime: new FormControl("22:00", Validators.required),

      managerName: new FormControl("", Validators.required),
      managerEmail: new FormControl("", [Validators.required, Validators.email]),
      managerPhone: new FormControl("", Validators.required),
    })
  }

  ngOnInit() {

  }

  setDaysOpen(days: string[]) {
    this.daysOpen = days
  }

  onClickCancel() {
    this.onClickCancelButton.emit()
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.formFields.get(fieldName)
    return !!(field?.invalid && field?.touched)
  }

  onSubmit() {
    if (this.formFields.invalid) {
      this.formFields.markAllAsTouched()
      return
    }
    const payload = { ...this.formFields.value, daysOpen: this.daysOpen }
    console.log(payload)
    // chamada ao service/API aqui
  }

}
