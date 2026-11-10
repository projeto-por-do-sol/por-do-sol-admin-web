import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { CouponsPage } from './coupons-page';
import { CouponService } from '../../services/coupon-service';
import { CouponListSkeleton } from '../../feature/coupon-list-skeleton/coupon-list-skeleton';

describe('CouponsPage enquanto carrega', () => {
  let fixture: ComponentFixture<CouponsPage>;
  const loadCoupons = vi.fn<() => Promise<void>>();
  const element = () => fixture.nativeElement as HTMLElement;

  beforeEach(() => {
    loadCoupons.mockReset();
    TestBed.overrideComponent(CouponsPage, { set: { imports: [CouponListSkeleton], schemas: [CUSTOM_ELEMENTS_SCHEMA] } });
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: CouponService, useValue: { loadCoupons, failedKiosks: signal([]) } }],
    });
  });

  async function render() {
    fixture = TestBed.createComponent(CouponsPage);
    await fixture.whenStable();
  }

  it('mostra o skeleton da lista e mantém o formulário de cadastro disponível', async () => {
    loadCoupons.mockReturnValue(new Promise(() => undefined));
    await render();

    expect(element().querySelector('[role="status"]')?.textContent).toContain('Carregando cupons...');
    expect(element().querySelector('app-coupon-list-skeleton')).toBeTruthy();
    expect(element().querySelector('app-coupon-list')).toBeNull();
    expect(element().querySelector('app-coupon-register-form')).toBeTruthy();
  });

  it('troca o skeleton pela lista quando os cupons chegam', async () => {
    loadCoupons.mockResolvedValue(undefined);
    await render();

    expect(element().querySelector('app-coupon-list-skeleton')).toBeNull();
    expect(element().querySelector('app-coupon-list')).toBeTruthy();
  });

  it('mostra o erro no lugar do skeleton quando a API falha', async () => {
    loadCoupons.mockRejectedValue(new Error('falhou'));
    await render();

    expect(element().querySelector('[role="alert"]')).toBeTruthy();
    expect(element().querySelector('app-coupon-list-skeleton')).toBeNull();
  });
});
