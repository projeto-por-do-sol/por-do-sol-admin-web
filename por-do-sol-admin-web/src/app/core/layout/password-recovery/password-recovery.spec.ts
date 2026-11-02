import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { PasswordRecoveryService } from '../../services/password-recovery-service'

import { PasswordRecovery } from './password-recovery'

describe('PasswordRecovery', () => {
  let component: PasswordRecovery
  let fixture: ComponentFixture<PasswordRecovery>

  beforeEach(async () => {
    localStorage.removeItem('password-recovery-state-v3')
    await TestBed.configureTestingModule({
      imports: [PasswordRecovery],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents()

    TestBed.inject(PasswordRecoveryService).request('a@b.com', 'QUIOSQUE').subscribe()
    TestBed.inject(HttpTestingController).expectOne(r => r.url.endsWith('/auth/forgot-password')).flush(null)
    fixture = TestBed.createComponent(PasswordRecovery)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => fixture.destroy())

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('accepts only alphanumeric characters and advances focus', async () => {
    const inputs = fixture.nativeElement.querySelectorAll('[aria-label^="Caractere"]') as NodeListOf<HTMLInputElement>

    inputs[0].value = '#a'
    inputs[0].dispatchEvent(new Event('input'))
    await Promise.resolve()

    expect(component.code[0]).toBe('A')
    expect(document.activeElement).toBe(inputs[1])
  })

  it('keeps focus when deleting a character so it can be replaced immediately', () => {
    const inputs = fixture.nativeElement.querySelectorAll('[aria-label^="Caractere"]') as NodeListOf<HTMLInputElement>
    component.code[0] = 'A'
    component.code[1] = '2'
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()
    inputs[1].focus()

    inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }))

    expect(component.code[1]).toBe('')
    expect(inputs[1].value).toBe('')
    expect(document.activeElement).toBe(inputs[1])

    inputs[1].value = '3'
    inputs[1].dispatchEvent(new Event('input'))

    expect(component.code[1]).toBe('3')
    expect(document.activeElement).toBe(inputs[2])
  })

  it('moves back and clears the previous character when the current field is empty', () => {
    const inputs = fixture.nativeElement.querySelectorAll('[aria-label^="Caractere"]') as NodeListOf<HTMLInputElement>
    component.code[0] = 'A'
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()
    inputs[1].focus()

    inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }))

    expect(component.code[0]).toBe('')
    expect(inputs[0].value).toBe('')
    expect(document.activeElement).toBe(inputs[0])
  })

  it('distributes a pasted code across the four fields', () => {
    const inputs = fixture.nativeElement.querySelectorAll('[aria-label^="Caractere"]') as NodeListOf<HTMLInputElement>
    const event = new Event('paste', { cancelable: true }) as ClipboardEvent
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => 'a2b4' } })

    inputs[0].dispatchEvent(event)
    fixture.detectChanges()

    expect(component.code).toEqual(['A', '2', 'B', '4'])
    expect(Array.from(inputs, input => input.value)).toEqual(['A', '2', 'B', '4'])
  })

  it('immediately limits multiple characters entered in the last field', () => {
    const inputs = fixture.nativeElement.querySelectorAll('[aria-label^="Caractere"]') as NodeListOf<HTMLInputElement>

    inputs[3].value = 'abcd'
    inputs[3].dispatchEvent(new Event('input'))

    expect(inputs[3].value).toBe('A')
    expect(component.code[3]).toBe('A')
  })

  it('shows an error when the code is incomplete', () => {
    component.code[0] = 'A'

    component.confirmCode()

    expect(component.codeErrorMessage()).toContain('quatro caracteres')
  })

  it('rejects a wrong code returned as invalid by the API and stays on the page', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl')
    component.code.splice(0, 4, '5', 'P', 'G', 'B')

    component.confirmCode()
    const req = TestBed.inject(HttpTestingController).expectOne(r => r.url.endsWith('/auth/validate-reset-code'))
    expect(req.request.params.get('token')).toBe('5PGB')
    req.flush({ message: 'Código inválido ou expirado' }, { status: 400, statusText: 'Bad Request' })

    expect(component.codeErrorMessage()).toContain('incorreto')
    expect(TestBed.inject(PasswordRecoveryService).hasCode).toBe(false)
    expect(navigate).not.toHaveBeenCalledWith('/passwordReset')
  })

  it('stores the code and goes to the reset step when the API accepts it', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl')
    component.code.splice(0, 4, 'A', '2', 'B', '4')
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    TestBed.inject(HttpTestingController).expectOne(r => r.url.endsWith('/auth/validate-reset-code')).flush(null)

    expect(TestBed.inject(PasswordRecoveryService).hasCode).toBe(true)
    expect(navigate).toHaveBeenCalledWith('/passwordReset')
  })

  it('keeps resend blocked right after arriving, even with stale localStorage', () => {
    localStorage.setItem('password-recovery-state-v3', JSON.stringify({ usedRequests: 0, requestsLockedUntil: 0, resendAvailableAt: 0 }))
    fixture.destroy()
    fixture = TestBed.createComponent(PasswordRecovery)
    component = fixture.componentInstance
    fixture.detectChanges()

    expect(component.resendSeconds()).toBeGreaterThan(290)
    component.requestNewCode()
    TestBed.inject(HttpTestingController).expectNone(r => r.url.endsWith('/auth/forgot-password'))
  })

  it('requests a new code from the API and starts the cooldown', () => {
    component.resendAvailableAt.set(0)
    component.now.set(Date.now() - 2_000)

    component.requestNewCode()
    const req = TestBed.inject(HttpTestingController).expectOne(r => r.url.endsWith('/auth/forgot-password'))
    expect(req.request.body).toEqual({ email: 'a@b.com', tipoConta: 'QUIOSQUE' })
    req.flush(null)

    expect(component.resendSeconds()).toBe(305)
    expect(component.remainingRequests()).toBe(4)
  })

  it('locks new requests after five requests', () => {
    const http = TestBed.inject(HttpTestingController)
    for (let request = 0; request < 5; request++) {
      component.resendAvailableAt.set(0)
      component.requestNewCode()
      http.expectOne(r => r.url.endsWith('/auth/forgot-password')).flush(null)
    }

    expect(component.areRequestsLocked()).toBe(true)
    expect(component.requestLockSeconds()).toBe(600)
  })

  it('restores requests after their ten-minute lock expires', () => {
    localStorage.setItem('password-recovery-state-v3', JSON.stringify({
      usedRequests: 5,
      requestsLockedUntil: Date.now() - 1,
    }))

    fixture.destroy()
    fixture = TestBed.createComponent(PasswordRecovery)
    component = fixture.componentInstance
    fixture.detectChanges()

    expect(component.remainingRequests()).toBe(5)
    expect(component.areRequestsLocked()).toBe(false)
  })
})
