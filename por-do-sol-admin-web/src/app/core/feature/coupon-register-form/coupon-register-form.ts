import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Input } from '../../shared/ui/input/input';
import { Button } from '../../shared/ui/button/button';
import { Select } from '../../shared/ui/select/select';
import { CouponRequest, CouponType } from '../../models/coupon';
import { CouponService, couponErrorMessage } from '../../services/coupon-service';
import { KioskService } from '../../services/kiosk-service';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { NotificationService } from '../../services/notification-service';
import { parseBrl } from '../../utils/money';

const PERCENT_MIN = 5
const PERCENT_MAX = 95

@Component({
  selector: 'app-coupon-register-form',
  imports: [Input, Button, Select, ReactiveFormsModule],
  templateUrl: './coupon-register-form.html',
  styleUrl: './coupon-register-form.css',
})
export class CouponRegisterForm {

  private readonly couponService = inject(CouponService)
  private readonly notifications = inject(NotificationService)
  private readonly selectionService = inject(KioskSelectionService)
  private readonly destroyRef = inject(DestroyRef)
  readonly kiosks = inject(KioskService).kiosks

  readonly type = signal<CouponType>('PERCENTUAL')
  readonly isPercent = computed(() => this.type() === 'PERCENTUAL')
  readonly isLoading = signal(false)
  readonly errorMessage = signal('')

  readonly formFields = new FormGroup({
    kioskId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    discount: new FormControl('', { nonNullable: true, validators: [Validators.required, this.discountValidator()] }),
    minOrder: new FormControl('', { nonNullable: true, validators: [Validators.required, this.positiveMoneyValidator()] }),
    maxDiscount: new FormControl('', { nonNullable: true, validators: this.positiveMoneyValidator() }),
    expiresAt: new FormControl('', { nonNullable: true, validators: [Validators.required, this.futureDateValidator()] }),
  })

  readonly kioskNames = computed(() => this.kiosks().map(kiosk => kiosk.name ?? '').filter(Boolean))
  private readonly kioskId = toSignal(this.formFields.controls.kioskId.valueChanges, { initialValue: '' })
  readonly selectedKioskName = computed(() => this.kiosks().find(kiosk => kiosk.id === this.kioskId())?.name ?? '')

  constructor() {
    this.formFields.controls.expiresAt.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      if (value) this.formFields.controls.expiresAt.markAsTouched()
    })

    effect(() => {
      const selected = this.selectionService.selectedKioskId()
      const kiosks = this.kiosks()
      const kioskId = selected ?? (kiosks.length === 1 ? kiosks[0].id : null)
      if (kioskId) this.formFields.controls.kioskId.setValue(kioskId)
    })
  }

  selectKiosk(name: string) {
    const control = this.formFields.controls.kioskId
    control.setValue(this.kiosks().find(kiosk => kiosk.name === name)?.id ?? '')
    control.markAsTouched()
  }

  clampExpiresAt() {
    const control = this.formFields.controls.expiresAt
    const min = this.minExpiresAt()
    if (control.value && new Date(control.value).getTime() < new Date(min).getTime()) control.setValue(min)
  }

  setType(type: CouponType) {
    if (this.isLoading() || this.type() === type) return
    this.type.set(type)

    const { discount, maxDiscount } = this.formFields.controls
    discount.reset('')
    maxDiscount.reset('')
  }

  minExpiresAt(): string {
    const next = new Date(Date.now() + 60_000)
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}T${pad(next.getHours())}:${pad(next.getMinutes())}`
  }

  onSubmit() {
    if (this.isLoading()) return
    this.formFields.controls.expiresAt.updateValueAndValidity()
    if (this.formFields.invalid) {
      this.formFields.markAllAsTouched()
      return
    }

    this.isLoading.set(true)
    this.errorMessage.set('')
    this.formFields.disable()

    this.couponService.createCoupon(this.formFields.getRawValue().kioskId, this.toPayload()).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.isLoading.set(false)
        this.formFields.enable()
      }),
    ).subscribe({
      next: () => {
        this.notifications.success('Cupom cadastrado com sucesso.')
        const { discount, minOrder, maxDiscount, expiresAt } = this.formFields.controls
        for (const control of [discount, minOrder, maxDiscount, expiresAt]) control.reset('')
      },
      error: (error: HttpErrorResponse) =>
        this.errorMessage.set(couponErrorMessage(error, 'Não foi possível cadastrar o cupom. Verifique os dados e tente novamente.')),
    })
  }

  private toPayload(): CouponRequest {
    const values = this.formFields.getRawValue()
    const percent = this.isPercent()
    return {
      tipoCupom: this.type(),
      valorDesconto: percent ? Number(values.discount) : parseBrl(values.discount)!,
      valorMinimo: parseBrl(values.minOrder)!,
      descontoMaximo: percent ? parseBrl(values.maxDiscount) : null,
      dataExpiracao: values.expiresAt.length === 16 ? `${values.expiresAt}:00` : values.expiresAt,
    }
  }

  private discountValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null
      if (this.type() === 'PERCENTUAL') {
        const value = Number(control.value)
        return value >= PERCENT_MIN && value <= PERCENT_MAX
          ? null
          : { message: `O percentual deve ficar entre ${PERCENT_MIN}% e ${PERCENT_MAX}%` }
      }
      return this.positiveMoneyValidator()(control)
    }
  }

  private positiveMoneyValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null
      const value = parseBrl(control.value)
      return value !== null && value > 0 ? null : { message: 'Informe um valor maior que zero' }
    }
  }

  private futureDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null
      const date = new Date(control.value)
      return date.getTime() > Date.now() ? null : { message: 'A validade deve estar no futuro' }
    }
  }

}
