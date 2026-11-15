import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { PasswordRecoveryService, recoveryQuota } from './password-recovery-service'

const MINUTE = 60_000
const minutes = (...values: number[]) => values.map(value => value * MINUTE)

describe('recoveryQuota', () => {
  it('allows five sends without history', () => {
    expect(recoveryQuota([], 0)).toEqual({ remaining: 5, lockedUntil: 0, resendAvailableAt: 0 })
  })

  it('waits one minute between sends', () => {
    const quota = recoveryQuota(minutes(0), 30_000)
    expect(quota.remaining).toBe(4)
    expect(quota.resendAvailableAt).toBe(MINUTE)
  })

  it('locks for ten minutes after the fifth send of a batch', () => {
    const sends = minutes(0, 1, 2, 3, 4)
    expect(recoveryQuota(sends, 5 * MINUTE).lockedUntil).toBe(14 * MINUTE)
    expect(recoveryQuota(sends, 13 * MINUTE).remaining).toBe(0)
    expect(recoveryQuota(sends, 14 * MINUTE)).toEqual({ remaining: 5, lockedUntil: 0, resendAvailableAt: 0 })
  })

  it('starts a new batch after ten minutes without sending', () => {
    const quota = recoveryQuota(minutes(1, 2, 3, 4, 14), 15 * MINUTE)
    expect(quota.remaining).toBe(4)
    expect(quota.lockedUntil).toBe(0)
  })

  it('locks spaced sends that stay within ten minutes of each other', () => {
    expect(recoveryQuota(minutes(0, 3, 6, 9, 12), 13 * MINUTE).lockedUntil).toBe(22 * MINUTE)
  })
})

describe('PasswordRecoveryService send history', () => {
  let service: PasswordRecoveryService
  let http: HttpTestingController
  let clock: number

  const flushSend = () => http.expectOne(r => r.url.endsWith('/auth/forgot-password')).flush(null)
  const request = (email: string) => {
    service.request(email, 'QUIOSQUE').subscribe()
    flushSend()
  }
  const resend = () => {
    service.resend().subscribe()
    flushSend()
  }

  beforeEach(() => {
    clock = Date.now()
    vi.spyOn(Date, 'now').mockImplementation(() => clock)
    localStorage.removeItem('password-recovery-sends-v1')
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] })
    service = TestBed.inject(PasswordRecoveryService)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => vi.restoreAllMocks())

  it('keeps counting sends for the same account', () => {
    request('a@b.com')
    clock += MINUTE
    resend()
    clock += MINUTE
    request('A@B.com')

    expect(service.sendTimes().length).toBe(3)
  })

  it('restarts the history when another account is requested', () => {
    request('errado@b.com')
    request('certo@b.com')

    expect(service.sendTimes().length).toBe(1)
  })

  it('does not count a request made before one minute', () => {
    request('a@b.com')
    clock += 30_000
    resend()

    expect(service.sendTimes()).toEqual([clock - 30_000])
  })

  it('keeps the lock running when the same account requests again while locked', () => {
    request('a@b.com')
    for (let send = 0; send < 4; send++) {
      clock += MINUTE
      resend()
    }
    const lockedUntil = recoveryQuota(service.sendTimes(), clock).lockedUntil

    clock += 4 * MINUTE
    request('a@b.com')

    expect(service.sendTimes().length).toBe(5)
    expect(recoveryQuota(service.sendTimes(), clock).lockedUntil).toBe(lockedUntil)
    expect(lockedUntil - clock).toBe(6 * MINUTE)
  })
})
