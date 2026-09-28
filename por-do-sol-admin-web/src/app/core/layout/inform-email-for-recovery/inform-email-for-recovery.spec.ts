import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { InformEmailForRecovery } from './inform-email-for-recovery';

describe('InformEmailForRecovery', () => {
  let component: InformEmailForRecovery;
  let fixture: ComponentFixture<InformEmailForRecovery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformEmailForRecovery],
      providers: [provideRouter([])],
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

  it('navigates to password recovery after a valid e-mail is submitted', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const input = form.querySelector('input[type="email"]') as HTMLInputElement;

    input.value = 'usuario@exemplo.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(navigate).toHaveBeenCalledWith('/passwordRecovery');
  });
});
