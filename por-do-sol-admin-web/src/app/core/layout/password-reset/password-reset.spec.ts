import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { PasswordReset } from './password-reset';

describe('PasswordReset', () => {
  let component: PasswordReset;
  let fixture: ComponentFixture<PasswordReset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordReset],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordReset);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('focuses each password field when its label is clicked', () => {
    const labels = fixture.nativeElement.querySelectorAll('label') as NodeListOf<HTMLLabelElement>;
    const inputs = fixture.nativeElement.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>;

    labels.forEach((label, index) => {
      expect(label.control).toBe(inputs[index]);
      label.click();
      expect(document.activeElement).toBe(inputs[index]);
    });
  });

  it('requires both passwords and at least eight characters', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Campo obrigatório');
    expect(navigate).not.toHaveBeenCalled();

    component.form.patchValue({ password: 'short', passwordConfirmation: 'short' });
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Mínimo de 8 caracteres');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('rejects passwords that do not match', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    component.form.patchValue({ password: 'password123', passwordConfirmation: 'different123' });

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('As senhas não coincidem');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('returns to login after matching valid passwords are submitted', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const inputs = form.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>;

    for (const input of inputs) {
      input.value = 'password123';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
