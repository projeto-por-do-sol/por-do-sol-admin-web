import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { API_BASE_URL } from '../config/api'

/** Valores aceitos pelo enum TipoConta da API: QUIOSQUE = proprietário. */
export type RecoveryAccountType = 'QUIOSQUE' | 'FUNCIONARIO'

@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
  private readonly http = inject(HttpClient)

  // O fluxo passa por três telas; os dados ficam só em memória (nunca em localStorage).
  private email = ''
  private _accountType: RecoveryAccountType = 'QUIOSQUE'
  private code = ''
  private _lastSentAt = 0

  get accountType(): RecoveryAccountType {
    return this._accountType
  }

  // Momento (ms) do último envio aceito pela API; a API ignora novos envios por 5 minutos.
  get lastSentAt(): number {
    return this._lastSentAt
  }

  get hasPendingRecovery(): boolean {
    return !!this.email
  }

  get hasCode(): boolean {
    return !!this.code
  }

  request(email: string, accountType: RecoveryAccountType): Observable<void> {
    this.email = email
    this._accountType = accountType
    this.code = ''
    this._lastSentAt = 0
    return this.send()
  }

  resend(): Observable<void> {
    return this.send()
  }

  // Confirma na API que o código pertence a este e-mail, sem consumi-lo.
  validateCode(code: string): Observable<void> {
    return this.http
      .post<void>(
        `${API_BASE_URL}/auth/validate-reset-code`,
        { email: this.email, tipoConta: this._accountType },
        { params: { token: code } },
      )
      .pipe(tap(() => (this.code = code)))
  }

  reset(password: string): Observable<void> {
    return this.http.post<void>(
      `${API_BASE_URL}/auth/reset-password`,
      { password, email: this.email, tipoConta: this._accountType },
      { params: { token: this.code } },
    )
  }

  clear(): void {
    this.email = ''
    this.code = ''
    this._lastSentAt = 0
  }

  private send(): Observable<void> {
    return this.http
      .post<void>(`${API_BASE_URL}/auth/forgot-password`, {
        email: this.email,
        tipoConta: this._accountType,
      })
      .pipe(tap(() => (this._lastSentAt = Date.now())))
  }
}

export function recoveryErrorMessage(error: HttpErrorResponse, fallback: string): string {
  if (error.status === 0) return 'Não foi possível conectar à API. Verifique sua conexão e tente novamente.'
  if (error.status === 400) return 'Código inválido ou expirado.'
  return fallback
}
