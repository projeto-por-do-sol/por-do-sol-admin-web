import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api';
import { Coupon, CouponRequest, CouponResponse } from '../models/coupon';
import { KioskService } from './kiosk-service';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class CouponService {

  private readonly http = inject(HttpClient)
  private readonly kioskService = inject(KioskService)
  private readonly userService = inject(UserService)

  private readonly _coupons = signal<Coupon[]>([])
  readonly coupons = this._coupons.asReadonly()

  readonly failedKiosks = signal<string[]>([])

  constructor() {
    effect(() => {
      if (this.userService.user()) return
      this._coupons.set([])
      this.failedKiosks.set([])
    })
  }

  async loadCoupons(): Promise<void> {
    await this.kioskService.ensureKiosks()
    const kiosks = this.kioskService.kiosks()

    const results = await Promise.allSettled(kiosks.map(kiosk =>
      firstValueFrom(this.http.get<CouponResponse[]>(`${API_BASE_URL}/quiosques/${kiosk.id}/cupons/gerenciamento`))))

    if (kiosks.length > 0 && results.every(result => result.status === 'rejected')) {
      throw (results[0] as PromiseRejectedResult).reason
    }

    const coupons: Coupon[] = []
    const failed: string[] = []
    results.forEach((result, index) => {
      const kiosk = kiosks[index]
      if (result.status === 'rejected') {
        failed.push(kiosk.name ?? kiosk.id!)
        return
      }
      coupons.push(...result.value.map(coupon => ({ ...coupon, kioskId: kiosk.id!, kioskName: kiosk.name ?? '' })))
    })

    this._coupons.set(coupons.sort((a, b) => b.id - a.id))
    this.failedKiosks.set(failed)
  }

  createCoupon(kioskId: string, request: CouponRequest): Observable<CouponResponse> {
    return this.http.post<CouponResponse>(`${API_BASE_URL}/quiosques/${kioskId}/cupons`, request).pipe(
      tap(response => {
        const kiosk = this.kioskService.kiosks().find(item => item.id === kioskId)
        this._coupons.update(coupons => [{ ...response, kioskId, kioskName: kiosk?.name ?? '' }, ...coupons])
      }),
    )
  }


  toggleCoupon(coupon: Coupon): Observable<CouponResponse> {
    return this.http.patch<CouponResponse>(`${API_BASE_URL}/quiosques/${coupon.kioskId}/cupons/${coupon.id}`, null).pipe(
      tap(response => this.replace(coupon, response)),
    )
  }

  deleteCoupon(coupon: Coupon): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/quiosques/${coupon.kioskId}/cupons/${coupon.id}`).pipe(
      tap(() => this._coupons.update(coupons => coupons.filter(item => !(item.id === coupon.id && item.kioskId === coupon.kioskId)))),
    )
  }

  private replace(coupon: Coupon, response: CouponResponse) {
    this._coupons.update(coupons => coupons.map(item =>
      item.id === coupon.id && item.kioskId === coupon.kioskId ? { ...item, ...response } : item))
  }

}

export function couponErrorMessage(error: HttpErrorResponse, fallback: string): string {
  if (error.status === 0) return 'Não foi possível conectar à API. Verifique sua conexão e tente novamente.'
  if (error.status === 401) return 'Sua sessão expirou. Entre novamente para continuar.'
  const message = error.error?.message
  if (typeof message === 'string' && message && !message.startsWith('Validation failed')) return message
  if (error.status === 403) return 'Somente o proprietário do quiosque pode gerenciar cupons.'
  return fallback
}
