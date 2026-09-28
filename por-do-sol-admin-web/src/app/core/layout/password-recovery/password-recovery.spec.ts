import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PasswordRecovery } from './password-recovery'

describe('PasswordRecovery', () => {
  let component: PasswordRecovery
  let fixture: ComponentFixture<PasswordRecovery>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecovery]
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

  it('returns to the previous field when deleting a character', async () => {
    const inputs = fixture.nativeElement.querySelectorAll('[aria-label^="Caractere"]') as NodeListOf<HTMLInputElement>
    component.code[0] = 'A'
    component.code[1] = '2'
    fixture.detectChanges()

    inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }))
    await Promise.resolve()

    expect(component.code[1]).toBe('')
    expect(document.activeElement).toBe(inputs[0])
  })

  it('limits new code requests to five within ten minutes', () => {
    component.cooldownSeconds.set(0)

    for (let request = 0; request < 5; request++) {
      component.requestNewCode()
      component.cooldownSeconds.set(0)
    }

    expect(component.remainingRequests()).toBe(0)
    expect(component.requestWindowSeconds()).toBeGreaterThan(0)
    expect(component.resendDisabled()).toBe(true)
  })

  it('shows an error when the code is incomplete', () => {
    component.code[0] = 'A'

    component.confirmCode()

    expect(component.codeErrorMessage()).toContain('quatro caracteres')
  })
})
