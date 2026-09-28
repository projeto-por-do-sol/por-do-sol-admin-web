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

  it('keeps focus when deleting a character so it can be replaced immediately', () => {
    const inputs = fixture.nativeElement.querySelectorAll('[aria-label^="Caractere"]') as NodeListOf<HTMLInputElement>
    component.code[0] = 'A'
    component.code[1] = '2'
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

  it('shows an error when the code is incomplete', () => {
    component.code[0] = 'A'

    component.confirmCode()

    expect(component.codeErrorMessage()).toContain('quatro caracteres')
  })

  it('shows an error when the code is incorrect', () => {
    component.code.splice(0, 4, 'A', 'B', 'C', 'D')

    component.confirmCode()

    expect(component.codeErrorMessage()).toContain('incorreto')
  })
})
