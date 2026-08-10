import { Component, computed, output, signal, Signal } from '@angular/core';
import { Input } from "../../shared/ui/input/input";
import { ChipMultiChoice } from "../../shared/ui/chip-multi-choice/chip-multi-choice";
import { CancelButton } from "../../shared/ui/cancel-button/cancel-button";
import { Button } from "../../shared/ui/button/button";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { PreviewItem } from '../../shared/ui/card-preview/card-preview';
import { Select } from "../../shared/ui/select/select";

@Component({
  selector: 'app-employee-register-form',
  imports: [Input, ChipMultiChoice, CancelButton, Button, ReactiveFormsModule, Select],
  templateUrl: './employee-register-form.html',
  styleUrl: './employee-register-form.css',
})
export class EmployeeRegisterForm {

  daysShift: string[] = []
  onClickCancelButton = output<void>()
  role = signal<string>("Funcionário")
  kiosk = signal<string>("")


  previewItems = computed<PreviewItem[]>(() => {
    const d = this.formValue();
    return [
      { label: 'Quiosque', value: `${this.kiosk() || 'Quiosque'}` },
      { label: 'Turno', value: `${d.startShift}-${d.finishShift}` },
    ];
  });

  previewName = computed(() => this.formValue().name || 'Novo colaborador')

  previewRole = computed(() => this.role)

  previewLastText = "Esse será o card exibido na aba <span class='text-outline'>Equipe</span> do painel assim que o cadastro for concluído."

  previewKioks = computed(() => this.kiosk)

  setDaysShift(days: string[]) {
    this.daysShift = days
  }

  onClickCancel() {
    this.onClickCancelButton.emit()
  }

  setRole(role: string) {
    this.role.set(role)
  }

  setKiok(kiosk: string) {
    this.kiosk.set(kiosk)
  }

  formFields: FormGroup
  formValue: Signal<any>

  constructor() {
    this.formFields = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", Validators.required),

      startShift: new FormControl("08:00", Validators.required),
      finishShift: new FormControl("22:00", Validators.required),
    })

    this.formValue = toSignal(this.formFields.valueChanges, {
      initialValue: this.formFields.value,
    });
  }

  onSubmit() {
    if (this.formFields.invalid) {
      this.formFields.markAllAsTouched()
      return
    }
    const payload = { ...this.formFields.value, daysShift: this.daysShift }
    console.log(payload)
    // chamada ao service/API aqui
  }

}
