import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { UserService } from '../../services/user-service';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  const login = vi.fn();

  beforeEach(async () => {
    login.mockReset();
    login.mockReturnValue(of({ id: 'user-id', name: 'Maria' }));

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: { login } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not submit invalid credentials', () => {
    component.login();

    expect(login).not.toHaveBeenCalled();
    expect(component.form.controls.email.touched).toBe(true);
    expect(component.form.controls.password.touched).toBe(true);
  });

  it('logs in and navigates to home', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    component.form.setValue({
      email: 'gerente-apollo',
      password: 'senha-segura',
      rememberMe: true,
    });

    component.login();

    expect(login).toHaveBeenCalledWith(
      { email: 'gerente-apollo', password: 'senha-segura' },
      true,
    );
    expect(navigate).toHaveBeenCalledWith('/home');
  });
});
