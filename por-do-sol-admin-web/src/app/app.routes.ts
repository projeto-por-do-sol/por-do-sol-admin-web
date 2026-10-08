import { Routes } from '@angular/router';
import { Home } from './core/layout/home/home';
import { KioskRegisterPage } from './core/layout/kiosk-register-page/kiosk-register-page';
import { EmployeeRegisterPage } from './core/layout/employee-register-page/employee-register-page';
import { OwnerRegistration } from './core/layout/owner-registration/owner-registration';
import { LoggedUser } from './core/layout/logged-user/logged-user';
import { Login } from './core/layout/login/login';
import { PasswordRecovery } from './core/layout/password-recovery/password-recovery';
import { InformEmailForRecovery } from './core/layout/inform-email-for-recovery/inform-email-for-recovery';
import { PasswordReset } from './core/layout/password-reset/password-reset';
import { KioskItemRegisterPage } from './core/layout/kiosk-item-register-page/kiosk-item-register-page';
import { CreateOrder } from './core/layout/create-order/create-order';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'ownerRegistration', component: OwnerRegistration },
  { path: 'informEmailForRecovery', component: InformEmailForRecovery },
  { path: 'passwordRecovery', component: PasswordRecovery },
  { path: 'passwordReset', component: PasswordReset },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    component: LoggedUser,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'kioskRegister', component: KioskRegisterPage },
      { path: 'employeeRegister', component: EmployeeRegisterPage },
      { path: 'employeeRegister/:id', component: EmployeeRegisterPage },
      { path: 'itemRegister', component: KioskItemRegisterPage },
      { path: 'itemRegister/:id', component: KioskItemRegisterPage },
      { path: 'createOrder', component: CreateOrder },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
