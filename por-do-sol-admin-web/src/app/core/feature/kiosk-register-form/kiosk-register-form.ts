import { Component, computed, DestroyRef, inject, output, signal, Signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Input } from "../../shared/ui/input/input";
import { CancelButton } from "../../shared/ui/cancel-button/cancel-button";
import { Button } from "../../shared/ui/button/button";
import { ChipMultiChoice } from "../../shared/ui/chip-multi-choice/chip-multi-choice";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { finalize, of, switchMap, tap } from 'rxjs';
import { PreviewItem } from '../../shared/ui/card-preview/card-preview';
import { ImageInput } from '../../shared/ui/image-input/image-input';
import { cnpjValidator } from '../../utils/cnpj';
import { LocationMap, MapLocation } from '../../shared/ui/location-map/location-map';
import { KioskService } from '../../services/kiosk-service';
import { KioskRegistrationRequest } from '../../models/kiosk-registration';

@Component({
  selector: 'app-kiosk-register-form',
  imports: [Input, CancelButton, Button, ChipMultiChoice, ReactiveFormsModule, ImageInput, LocationMap],
  templateUrl: './kiosk-register-form.html',
  styleUrl: './kiosk-register-form.css',
})
export class KioskRegisterForm {

  private readonly kioskService = inject(KioskService)
  private readonly destroyRef = inject(DestroyRef)
  private pendingImage: File | null = null
  readonly isLoading = signal(false)
  readonly errorMessage = signal('')
  readonly createdKioskId = signal<number | null>(null)
  saved = output<void>()

  daysOpen: string[] = []
  onClickCancelButton = output<void>()

  readonly imagePreview = signal<string | null>(null)

  previewItems = computed<PreviewItem[]>(() => {
    const d = this.formValue()
    return [
      { label: 'CNPJ', value: `${d.kioskCnpj || '00.000.000/0000-00'}` },
      { label: 'Endereço', value: `${d.kioskState || 'Estado'}, ${d.kioskCity || 'cidade'}` },
      { label: 'Horário', value: `${d.openTime}-${d.closeTime}` },
      // Cadastro de gestor desativado temporariamente.
      // { label: 'Gestor', value: `${d.managerName || '-'}` },
    ]
  })

  previewName = computed(() => this.formValue().kioskName || 'Novo quiosque')

  previewLastText = "Esse será o card exibido na aba <span class='text-outline'>Quiosques</span> do painel administrativo assim que o cadastro for concluído."

  formFields: FormGroup
  formValue: Signal<any>

  constructor() {
    this.formFields = new FormGroup({
      kioskName: new FormControl("", [Validators.required, Validators.pattern(/\S/)]),
      kioskCnpj: new FormControl("", [Validators.required, cnpjValidator(), Validators.pattern(/^[\d./-]+$/)]),
      kioskEmail: new FormControl("", [Validators.required, Validators.email]),
      kioskCep: new FormControl("", [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]),
      kioskState: new FormControl("", [Validators.required, Validators.pattern(/^[a-zA-Z]{2}$/)]),
      kioskCity: new FormControl("", [Validators.required, Validators.pattern(/\S/)]),
      kioskStreet: new FormControl(""),
      kioskNumber: new FormControl(""),
      kioskReference: new FormControl(""),
      latitude: new FormControl<number | null>(null, [Validators.required, Validators.min(-90), Validators.max(90)]),
      longitude: new FormControl<number | null>(null, [Validators.required, Validators.min(-180), Validators.max(180)]),
      openTime: new FormControl("08:00", Validators.required),
      closeTime: new FormControl("22:00", Validators.required),
      distAtendimento: new FormControl("", [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]),

      // Cadastro de gestor desativado temporariamente.
      // managerName: new FormControl("", Validators.required),
      // managerEmail: new FormControl("", [Validators.required, Validators.email]),
      // managerPhone: new FormControl("", Validators.required),
      profileImage: new FormControl<File | null>(null),
    })

    this.formValue = toSignal(this.formFields.valueChanges, {
      initialValue: this.formFields.value,
    })
  }

  ngOnInit() {

  }

  setDaysOpen(days: string[]) {
    if (this.isLoading() || this.createdKioskId() !== null) return
    this.daysOpen = days
  }

  setLocation(location: MapLocation) {
    if (this.isLoading() || this.createdKioskId() !== null) return
    this.formFields.patchValue({
      latitude: location.latitude,
      longitude: location.longitude,
    })

    this.formFields.get('latitude')?.markAsTouched()
    this.formFields.get('longitude')?.markAsTouched()
  }

  onClickCancel() {
    if (this.isLoading()) return
    this.onClickCancelButton.emit()
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.formFields.get(fieldName)
    return !!(field?.invalid && field?.touched)
  }

  onSubmit() {
    if (this.isLoading()) return
    if (this.createdKioskId() !== null) {
      this.submitRegistration()
      return
    }
    if (this.formFields.invalid) {
      this.formFields.markAllAsTouched()
      return
    }
    this.pendingImage = this.formFields.getRawValue().profileImage
    this.submitRegistration()
  }

  private submitRegistration() {
    const values = this.formFields.getRawValue()
    const payload: KioskRegistrationRequest = {
      nome: values.kioskName.trim(),
      email: values.kioskEmail.trim(),
      cnpj: values.kioskCnpj.replace(/\D/g, ''),
      openingTime: values.openTime.length === 5 ? `${values.openTime}:00` : values.openTime,
      closingTime: values.closeTime.length === 5 ? `${values.closeTime}:00` : values.closeTime,
      distAtendimento: Number(values.distAtendimento),
      cep: values.kioskCep.replace(/\D/g, ''),
      uf: values.kioskState.toUpperCase(),
      cidade: values.kioskCity.trim(),
      rua: values.kioskStreet.trim(),
      numero: values.kioskNumber.trim(),
      referencia: values.kioskReference.trim(),
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      // daysOpen: [...this.daysOpen],
    }

    this.isLoading.set(true)
    this.errorMessage.set('')
    this.formFields.disable()

    const kioskId = this.createdKioskId()
    const registration = kioskId !== null
      ? of({ id: kioskId })
      : this.kioskService.registerKiosk(payload)

    registration.pipe(
      tap(response => this.createdKioskId.set(response.id)),
      switchMap(response => this.pendingImage
        ? this.kioskService.uploadKioskImage(response.id, this.pendingImage)
        : of(null)),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.isLoading.set(false)
        if (this.createdKioskId() === null) this.formFields.enable()
      }),
    ).subscribe({
      next: () => this.saved.emit(),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.createdKioskId() !== null
          ? 'O quiosque foi cadastrado, mas a imagem não foi enviada. Tente enviar a imagem novamente ou continue sem ela.'
          : this.registrationErrorMessage(error))
      },
    })
  }

  private registrationErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Não foi possível conectar à API. Verifique sua conexão e tente novamente.'
    if (error.status === 401) return 'Sua sessão expirou. Entre novamente para cadastrar o quiosque.'
    if (error.status === 403) return 'Somente o proprietário pode cadastrar quiosques.'
    if (error.status === 409) return 'Verifique o CNPJ. O e-mail ou o CNPJ também pode estar cadastrado em outro quiosque.'
    if (error.status === 400) return 'Não foi possível cadastrar. Verifique os dados informados.'
    return 'Não foi possível concluir o cadastro. Tente novamente.'
  }

}
