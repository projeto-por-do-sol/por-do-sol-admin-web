import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'

import { PasswordRecovery } from './password-recovery'

describe('PasswordRecovery', () => {
  let component: PasswordRecovery
  let fixture: ComponentFixture<PasswordRecovery>

  beforeEach(async () => {
    localStorage.removeItem('password-recovery-state-v2')
    await TestBed.configureTestingModule({
      imports: [PasswordRecovery],
      providers: [provideRouter([])]
    }).compileComponents()

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

  it('confirms the code when the form is submitted', () => {
    component.code.splice(0, 4, '1', '2', '3', '4')
    fixture.detectChanges()

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement
    const button = form.querySelector('button[type="submit"]') as HTMLButtonElement
    expect(button).toBeTruthy()

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    expect(component.codeSuccessMessage()).toBe('Código confirmado.')
  })

  it('shows an error when the code is incorrect', () => {
    component.code.splice(0, 4, 'A', 'B', 'C', 'D')

    component.confirmCode()

    expect(component.codeErrorMessage()).toContain('incorreto')
    expect(component.remainingAttempts()).toBe(4)
  })

  it('locks confirmation for ten minutes after five complete incorrect codes', () => {
    component.code[0] = 'A'
    component.confirmCode()
    expect(component.remainingAttempts()).toBe(5)

    component.code.splice(0, 4, 'A', 'B', 'C', 'D')
    for (let attempt = 0; attempt < 4; attempt++) component.confirmCode()
    component.now.set(Date.now() - 2_000)
    component.confirmCode()

    expect(component.isLocked()).toBe(true)
    expect(component.lockSeconds()).toBe(600)
    expect(component.remainingAttempts()).toBe(0)

    component.code.splice(0, 4, '1', '2', '3', '4')
    component.confirmCode()
    expect(component.codeSuccessMessage()).toBe('')
  })

  it('starts another one-minute countdown after a simulated resend request', () => {
    expect(component.resendSeconds()).toBe(60)
    component.resendAvailableAt.set(0)
    component.now.set(Date.now() - 2_000)

    component.requestNewCode()

    expect(component.resendSeconds()).toBe(60)
    expect(component.resendMessage()).toContain('simulada')
    expect(component.remainingRequests()).toBe(4)
    expect(component.remainingAttempts()).toBe(5)
  })

  it('locks only new requests after five requests', () => {
    for (let request = 0; request < 5; request++) {
      component.resendAvailableAt.set(0)
      component.requestNewCode()
    }

    expect(component.remainingRequests()).toBe(0)
    expect(component.areRequestsLocked()).toBe(true)
    expect(component.requestLockSeconds()).toBe(600)
    expect(component.remainingAttempts()).toBe(5)
    expect(component.isLocked()).toBe(false)
    component.resendAvailableAt.set(0)
    component.requestNewCode()
    expect(component.remainingRequests()).toBe(0)
  })

  it('keeps requests available when code attempts are locked', () => {
    component.code.splice(0, 4, 'A', 'B', 'C', 'D')
    for (let attempt = 0; attempt < 5; attempt++) component.confirmCode()
    component.resendAvailableAt.set(0)

    component.requestNewCode()

    expect(component.isLocked()).toBe(true)
    expect(component.remainingRequests()).toBe(4)
  })

  it('keeps the lock after the component is recreated', () => {
    component.code.splice(0, 4, 'A', 'B', 'C', 'D')
    for (let attempt = 0; attempt < 5; attempt++) component.confirmCode()

    fixture.destroy()
    fixture = TestBed.createComponent(PasswordRecovery)
    component = fixture.componentInstance
    fixture.detectChanges()

    expect(component.isLocked()).toBe(true)
    expect(component.lockSeconds()).toBeGreaterThan(0)
  })

  it('restores requests after their ten-minute lock expires', () => {
    localStorage.setItem('password-recovery-state-v2', JSON.stringify({
      usedAttempts: 2,
      lockedUntil: 0,
      usedRequests: 5,
      requestsLockedUntil: Date.now() - 1,
      resendAvailableAt: 0,
    }))

    fixture.destroy()
    fixture = TestBed.createComponent(PasswordRecovery)
    component = fixture.componentInstance
    fixture.detectChanges()

    expect(component.remainingRequests()).toBe(5)
    expect(component.areRequestsLocked()).toBe(false)
    expect(component.remainingAttempts()).toBe(3)
  })
})
