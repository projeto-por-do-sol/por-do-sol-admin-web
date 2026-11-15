import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { API_BASE_URL } from '../config/api'

/** Valores aceitos pelo enum TipoConta da API: QUIOSQUE = proprietário. */
export type RecoveryAccountType = 'QUIOSQUE' | 'FUNCIONARIO'

const SENDS_STORAGE_KEY = 'password-recovery-sends-v1'
const SEND_INTERVAL_MS = 60_000
const MAX_SENDS = 5
const LOCK_MS = 10 * 60_000

export interface RecoveryQuota {
  remaining: number
  lockedUntil: number
  resendAvailableAt: number
}

// Mesma regra da API: envios a menos de 10 min um do outro formam um lote; 1 min entre
// envios e, ao chegar a 5 no lote, só libera após 10 min sem envio, restaurando os 5.
export function recoveryQuota(sendTimes: readonly number[], now: number): RecoveryQuota {
  const last = sendTimes.at(-1)
  if (last === undefined || now - last >= LOCK_MS) {
    return { remaining: MAX_SENDS, lockedUntil: 0, resendAvailableAt: 0 }
  }

  let batch = 1
  for (let i = sendTimes.length - 2; i >= 0 && batch < MAX_SENDS; i--) {
    if (sendTimes[i + 1] - sendTimes[i] >= LOCK_MS) break
    batch++
  }

  return {
    remaining: MAX_SENDS - batch,
    lockedUntil: batch >= MAX_SENDS ? last + LOCK_MS : 0,
    resendAvailableAt: last + SEND_INTERVAL_MS,
  }
}

// A API responde 200 mesmo quando ignora o pedido pelo limite; só conta como envio o que ela aceitaria.
export function recoverySendAccepted(sendTimes: readonly number[], now: number): boolean {
  const last = sendTimes.at(-1)
  if (last === undefined) return true
  return recoveryQuota(sendTimes, now).lockedUntil === 0 && now - last >= SEND_INTERVAL_MS
}

@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
  private readonly http = inject(HttpClient)

  // O fluxo passa por três telas; os dados ficam só em memória (nunca em localStorage).
  private email = ''
  private _accountType: RecoveryAccountType = 'QUIOSQUE'
  private code = ''
  private sendTimesOwner = ''
  private readonly _sendTimes = signal<number[]>(loadSendTimes())
  readonly sendTimes = this._sendTimes.asReadonly()

  get accountType(): RecoveryAccountType {
    return this._accountType
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
    // O limite da API é por conta; o histórico local não guarda o e-mail, então
    // recomeça quando a pessoa troca de conta na mesma sessão.
    const owner = `${accountType}:${email.toLowerCase()}`
    if (this.sendTimesOwner && this.sendTimesOwner !== owner) this.saveSendTimes([])
    this.sendTimesOwner = owner
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
  }

  private send(): Observable<void> {
    const accepted = recoverySendAccepted(this._sendTimes(), Date.now())
    return this.http
      .post<void>(`${API_BASE_URL}/auth/forgot-password`, {
        email: this.email,
        tipoConta: this._accountType,
      })
      .pipe(tap(() => {
        if (accepted) this.registerSend(Date.now())
      }))
  }

  private registerSend(time: number): void {
    this.saveSendTimes([...this._sendTimes(), time].slice(-MAX_SENDS))
  }

  private saveSendTimes(sendTimes: number[]): void {
    this._sendTimes.set(sendTimes)
    try {
      localStorage.setItem(SENDS_STORAGE_KEY, JSON.stringify(sendTimes))
    } catch {
      // Sem armazenamento, o limite vale só enquanto a página estiver aberta.
    }
  }
}

function loadSendTimes(): number[] {
  try {
    const saved = JSON.parse(localStorage.getItem(SENDS_STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? saved.filter(time => typeof time === 'number').slice(-MAX_SENDS) : []
  } catch {
    return []
  }
}

export function recoveryErrorMessage(error: HttpErrorResponse, fallback: string): string {
  if (error.status === 0) return 'Não foi possível conectar à API. Verifique sua conexão e tente novamente.'
  if (error.status === 400) return 'Código inválido ou expirado.'
  return fallback
}
