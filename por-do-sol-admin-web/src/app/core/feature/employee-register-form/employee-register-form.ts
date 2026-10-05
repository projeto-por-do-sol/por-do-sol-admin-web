import { Component, computed, ElementRef, inject, input, output, signal, Signal, effect, viewChild } from '@angular/core';
import { Input } from "../../shared/ui/input/input";
import { ChipMultiChoice } from "../../shared/ui/chip-multi-choice/chip-multi-choice";
import { CancelButton } from "../../shared/ui/cancel-button/cancel-button";
import { Button } from "../../shared/ui/button/button";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { PreviewItem } from '../../shared/ui/card-preview/card-preview';
import { Select } from "../../shared/ui/select/select";
import { KioskService } from '../../services/kiosk-service';
import { TeamService } from '../../services/team-service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-register-form',
  imports: [Input, ChipMultiChoice, CancelButton, Button, ReactiveFormsModule, Select],
  templateUrl: './employee-register-form.html',
  styleUrl: './employee-register-form.css',
})
export class EmployeeRegisterForm {

  private readonly kiosksService = inject(KioskService)
  private readonly teamService = inject(TeamService)
  private readonly removeDialog = viewChild<ElementRef<HTMLDialogElement>>('removeDialog')
  private kiosks = this.kiosksService.kiosks
  employee = input<Employee | null>(null)
  daysShift: string[] = []
  onClickCancelButton = output<void>()
  saved = output<void>()
  removed = output<void>()
  role = signal<string>("Funcionário")
  kiosk = signal<string>("")

  readonly kioskNames = computed(() => this.kiosks().map(kiosk => kiosk.name ?? '').filter(Boolean))
  readonly selectedDays = signal<string[]>([])

  previewItems = computed<PreviewItem[]>(() => {
    const d = this.formValue();
    return [
      { label: 'Quiosque', value: `${this.kiosk() || 'Quiosque'}` },
      { label: 'Turno', value: `${d.startShift}-${d.finishShift}` },
    ];
  });

  previewName = computed(() => this.formValue().name || 'Novo colaborador')

  previewRole = computed(() => this.role())

  get previewLastText(): string {
    return this.employee()
      ? "Esse card será atualizado na aba <span class='text-outline'>Equipe</span> quando as alterações forem salvas."
      : "Esse será o card exibido na aba <span class='text-outline'>Equipe</span> do painel assim que o cadastro for concluído."
  }

  previewKioks = computed(() => this.kiosk())

  setDaysShift(days: string[]) {
    this.daysShift = days
    this.selectedDays.set(days)
  }

  onClickCancel() {
    this.onClickCancelButton.emit()
  }

  openRemoveDialog() {
    if (this.employee()) this.removeDialog()?.nativeElement.showModal()
  }

  closeRemoveDialog() {
    this.removeDialog()?.nativeElement.close()
  }

  confirmRemoveEmployee() {
    const employee = this.employee()
    if (!employee?.id || !this.teamService.removeEmployee(employee.id)) return
    this.closeRemoveDialog()
    this.removed.emit()
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

    effect(() => {
      const employee = this.employee()
      if (!employee) {
        if (!this.kiosk()) this.kiosk.set(this.kioskNames()[0] ?? '')
        return
      }
      this.formFields.patchValue({
        name: employee.name ?? '',
        email: employee.email ?? '',
        phone: employee.phone ?? '',
        startShift: employee.startShift ?? '',
        finishShift: employee.finishShift ?? '',
      })
      this.kiosk.set(employee.kioskName ?? '')
      this.role.set(employee.role === 'Funcionario' ? 'Funcionário' : employee.role ?? 'Funcionário')
      this.daysShift = [...(employee.daysShift ?? [])]
      this.selectedDays.set(this.daysShift)
    })
  }

  onSubmit() {
    if (this.formFields.invalid) {
      this.formFields.markAllAsTouched()
      return
    }
    const kiosk = this.kiosks().find(item => item.name === this.kiosk())
    if (!kiosk) return
    const payload: Employee = {
      name: this.formFields.value.name?.trim(),
      email: this.formFields.value.email?.trim(),
      phone: this.formFields.value.phone,
      startShift: this.formFields.value.startShift,
      finishShift: this.formFields.value.finishShift,
      daysShift: this.daysShift,
      kioskId: kiosk.id,
      kioskName: kiosk.name,
      role: this.role(),
    }
    const employee = this.employee()
    if (employee?.id) {
      if (!this.teamService.updateEmployee(employee.id, payload)) return
    } else {
      this.teamService.addEmployee({ ...payload, status: false })
    }
    this.saved.emit()
  }

}
