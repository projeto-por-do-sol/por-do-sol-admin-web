import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { InformEmailForRecovery } from './inform-email-for-recovery';

describe('InformEmailForRecovery', () => {
  let component: InformEmailForRecovery;
  let fixture: ComponentFixture<InformEmailForRecovery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformEmailForRecovery],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(InformEmailForRecovery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows validation errors and stays on the page for an invalid e-mail', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Campo obrigatório');
    expect(navigate).not.toHaveBeenCalled();

    const input = form.querySelector('input[type="email"]') as HTMLInputElement;
    input.value = 'invalido';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('E-mail inválido');
    expect(navigate).not.toHaveBeenCalled();
  });

  function submit(email: string) {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const input = form.querySelector('input[type="email"]') as HTMLInputElement;
    input.value = email;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  it('requests a code for owners and navigates to password recovery', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    submit('usuario@exemplo.com');

    const req = TestBed.inject(HttpTestingController).expectOne(r => r.url.endsWith('/auth/forgot-password'));
    expect(req.request.body).toEqual({ email: 'usuario@exemplo.com', tipoConta: 'QUIOSQUE' });
    req.flush(null);

    expect(navigate).toHaveBeenCalledWith('/passwordRecovery');
  });

  it('sends a temporary password for team accounts and stays on the page', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    const buttons = fixture.nativeElement.querySelectorAll('[role="radio"]') as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    submit('equipe@exemplo.com');

    const req = TestBed.inject(HttpTestingController).expectOne(r => r.url.endsWith('/auth/forgot-password'));
    expect(req.request.body.tipoConta).toBe('FUNCIONARIO');
    req.flush(null);
    fixture.detectChanges();

    expect(component.teamEmailSent()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('senha provisória');
    expect(navigate).not.toHaveBeenCalled();
  });
});
