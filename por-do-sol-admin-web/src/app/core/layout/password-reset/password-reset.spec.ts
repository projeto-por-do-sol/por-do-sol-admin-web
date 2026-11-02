import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PasswordRecoveryService } from '../../services/password-recovery-service';

import { PasswordReset } from './password-reset';

describe('PasswordReset', () => {
  let component: PasswordReset;
  let fixture: ComponentFixture<PasswordReset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordReset],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const recovery = TestBed.inject(PasswordRecoveryService);
    recovery.request('a@b.com', 'QUIOSQUE').subscribe();
    recovery.validateCode('A2B4').subscribe();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(r => r.url.endsWith('/auth/forgot-password')).flush(null);
    http.expectOne(r => r.url.endsWith('/auth/validate-reset-code')).flush(null);

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

  it('sends the code and new password to the API, then returns to login', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    component.form.patchValue({ password: 'password123', passwordConfirmation: 'password123' });

    component.onSubmit();
    const req = TestBed.inject(HttpTestingController).expectOne(r => r.url.endsWith('/auth/reset-password'));
    expect(req.request.params.get('token')).toBe('A2B4');
    expect(req.request.body).toEqual({ password: 'password123', email: 'a@b.com', tipoConta: 'QUIOSQUE' });
    req.flush(null);

    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('shows an error and stays on the page when the API rejects the code', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    component.form.patchValue({ password: 'password123', passwordConfirmation: 'password123' });

    component.onSubmit();
    TestBed.inject(HttpTestingController)
      .expectOne(r => r.url.endsWith('/auth/reset-password'))
      .flush({ message: 'Token inválido' }, { status: 500, statusText: 'Server Error' });

    expect(component.errorMessage()).toContain('Código inválido');
    expect(navigate).not.toHaveBeenCalledWith('/login');
  });
});
