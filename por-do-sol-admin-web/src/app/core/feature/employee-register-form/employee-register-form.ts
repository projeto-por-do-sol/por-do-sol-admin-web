import { HttpErrorResponse } from '@angular/common/http';
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
import { NotificationService } from '../../services/notification-service';
import { PermissionService } from '../../services/permission-service';

@Component({
  selector: 'app-employee-register-form',
  imports: [Input, ChipMultiChoice, CancelButton, Button, ReactiveFormsModule, Select],
  templateUrl: './employee-register-form.html',
  styleUrl: './employee-register-form.css',
})
export class EmployeeRegisterForm {

  private readonly kiosksService = inject(KioskService)
  private readonly teamService = inject(TeamService)
  private readonly notifications = inject(NotificationService)
  readonly permissions = inject(PermissionService)
  private readonly removeDialog = viewChild<ElementRef<HTMLDialogElement>>('removeDialog')
  private kiosks = this.kiosksService.kiosks
  employee = input<Employee | null>(null)
  daysShift: string[] = []
  onClickCancelButton = output<void>()
  saved = output<void>()
  removed = output<void>()
  role = signal<string>("Funcionário")
  kiosk = signal<string>("")
  saving = signal(false)

  readonly kioskNames = computed(() => this.kiosks().map(kiosk => kiosk.name ?? '').filter(Boolean))
  readonly selectedDays = signal<string[]>([])

  // O backend só deixa o proprietário cadastrar gerentes.
  readonly roleOptions = computed(() => {
    if (this.permissions.isOwner()) return ['Funcionário', 'Gerente']
    const current = this.employee()?.role
    return current && current !== 'Funcionário' ? ['Funcionário', current] : ['Funcionário']
  })

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

  async confirmRemoveEmployee() {
    const employee = this.employee()
    if (!employee?.id || this.saving()) return
    this.saving.set(true)
    try {
      await this.teamService.removeEmployee(employee.id)
      this.closeRemoveDialog()
      this.notifications.success('Funcionário removido com sucesso.')
      this.removed.emit()
    } catch (error) {
      this.closeRemoveDialog()
      this.notifications.error(this.errorMessage(error))
    } finally { this.saving.set(false) }
  }

  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'Não foi possível conectar à API. Verifique a conexão e tente novamente.'
      if (error.status === 401) return 'Sua sessão expirou. Entre novamente.'
      if (error.status === 403) return 'Você não tem permissão para realizar esta operação neste quiosque.'
      if (error.status === 404) return 'Funcionário não encontrado neste quiosque.'
      if (error.status === 409) return error.error?.message || 'Já existe um funcionário com estes dados.'
      if (error.status >= 500) return 'Não foi possível salvar. Verifique os dados e tente novamente.'
      return error.error?.message || error.error?.detail || (typeof error.error === 'string' && error.error ? error.error : 'Não foi possível salvar. Tente novamente.')
    }
    return error instanceof Error ? error.message : 'Não foi possível salvar. Tente novamente.'
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
      this.formFields.controls['email'].disable({ emitEvent: false })
      this.kiosk.set(employee.kioskName ?? '')
      this.role.set(employee.role === 'Funcionario' ? 'Funcionário' : employee.role ?? 'Funcionário')
      this.daysShift = [...(employee.daysShift ?? [])]
      this.selectedDays.set(this.daysShift)
    })
  }

  async onSubmit() {
    if (this.saving()) return
    if (this.formFields.invalid) {
      this.formFields.markAllAsTouched()
      return
    }
    const employee = this.employee()
    const kiosk = this.kiosks().find(item => employee ? item.id === employee.kioskId : item.name === this.kiosk())
    if (!kiosk) return
    const payload: Employee = {
      name: this.formFields.value.name?.trim(),
      email: this.formFields.getRawValue().email?.trim(),
      phone: this.formFields.value.phone,
      startShift: this.formFields.value.startShift,
      finishShift: this.formFields.value.finishShift,
      daysShift: this.daysShift,
      kioskId: kiosk.id,
      kioskName: kiosk.name,
      role: this.role(),
    }
    this.saving.set(true)
    try {
      if (employee?.id) {
        await this.teamService.updateEmployee(employee.id, payload)
        this.notifications.success('Funcionário atualizado com sucesso.')
        this.saved.emit()
      } else {
        await this.teamService.addEmployee(payload)
        this.notifications.success('Funcionário cadastrado com sucesso.')
        this.saved.emit()
      }
    } catch (error) {
      this.notifications.error(this.errorMessage(error), 10000)
    } finally { this.saving.set(false) }
  }

}
