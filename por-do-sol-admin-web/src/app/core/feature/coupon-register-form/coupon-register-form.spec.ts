import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { CouponRegisterForm } from './coupon-register-form';
import { CouponService } from '../../services/coupon-service';
import { KioskService } from '../../services/kiosk-service';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { NotificationService } from '../../services/notification-service';

describe('CouponRegisterForm', () => {
  let component: CouponRegisterForm;
  let fixture: ComponentFixture<CouponRegisterForm>;
  const createCoupon = vi.fn(() => of({}))

  beforeEach(async () => {
    createCoupon.mockClear()
    await TestBed.configureTestingModule({
      imports: [CouponRegisterForm],
      providers: [
        { provide: CouponService, useValue: { createCoupon } },
        { provide: KioskService, useValue: { kiosks: signal([{ id: '1', name: 'Cantinho' }, { id: '2', name: 'Maré' }]) } },
        { provide: KioskSelectionService, useValue: { selectedKioskId: signal<string | null>(null) } },
        { provide: NotificationService, useValue: { success: vi.fn(), error: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponRegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function futureDate(): string {
    const date = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  it('limits the percentage between 5% and 95%', () => {
    const discount = component.formFields.controls.discount

    discount.setValue('4')
    expect(discount.errors?.['message']).toContain('entre 5% e 95%')
    discount.setValue('96')
    expect(discount.invalid).toBe(true)
    discount.setValue('50')
    expect(discount.valid).toBe(true)
  });

  it('requires a fixed discount greater than zero and clears the value when the type changes', () => {
    const discount = component.formFields.controls.discount
    discount.setValue('50')

    component.setType('FIXO')
    expect(discount.value).toBe('')

    discount.setValue('0,00')
    expect(discount.invalid).toBe(true)
    discount.setValue('30,00')
    expect(discount.valid).toBe(true)
  });

  it('rejects an expiration date in the past', () => {
    const expiresAt = component.formFields.controls.expiresAt

    expiresAt.setValue('2020-01-01T10:00')
    expect(expiresAt.errors?.['message']).toBe('A validade deve estar no futuro')
    expiresAt.setValue(futureDate())
    expect(expiresAt.valid).toBe(true)
  });

  it('adjusts a past expiration date to the earliest valid one when editing ends', () => {
    const expiresAt = component.formFields.controls.expiresAt
    expiresAt.setValue('2020-01-01T10:00')
    expect(expiresAt.touched).toBe(true)

    component.clampExpiresAt()

    expect(expiresAt.value).toBe(component.minExpiresAt())
    expect(expiresAt.valid).toBe(true)

    const future = futureDate()
    expiresAt.setValue(future)
    component.clampExpiresAt()
    expect(expiresAt.value).toBe(future)
  });

  it('does not submit an invalid form', () => {
    component.onSubmit()

    expect(createCoupon).not.toHaveBeenCalled()
    expect(component.formFields.controls.discount.touched).toBe(true)
  });

  it('sends a percentage coupon with the optional cap and the local date without conversion', () => {
    const expiresAt = futureDate()
    component.formFields.setValue({ kioskId: '2', discount: '15', minOrder: '1.250,50', maxDiscount: '20,00', expiresAt })

    component.onSubmit()

    expect(createCoupon).toHaveBeenCalledWith('2', {
      tipoCupom: 'PERCENTUAL',
      valorDesconto: 15,
      valorMinimo: 1250.5,
      descontoMaximo: 20,
      dataExpiracao: `${expiresAt}:00`,
    })
  });

  it('sends a fixed coupon without a cap', () => {
    component.setType('FIXO')
    component.formFields.setValue({ kioskId: '1', discount: '30,00', minOrder: '200,00', maxDiscount: '99,00', expiresAt: futureDate() })

    component.onSubmit()

    expect(createCoupon).toHaveBeenCalledWith('1', expect.objectContaining({
      tipoCupom: 'FIXO', valorDesconto: 30, valorMinimo: 200, descontoMaximo: null,
    }))
  });
});
