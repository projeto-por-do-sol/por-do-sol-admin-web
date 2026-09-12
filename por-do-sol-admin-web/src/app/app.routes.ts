import { Routes } from '@angular/router';
import { Home } from './core/layout/home/home';
import { KioskRegisterPage } from './core/layout/kiosk-register-page/kiosk-register-page';
import { EmployeeRegisterPage } from './core/layout/employee-register-page/employee-register-page';
import { OwnerRegistration } from './core/layout/owner-registration/owner-registration';
import { LoggedUser } from './core/layout/logged-user/logged-user';
import { Login } from './core/layout/login/login';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'ownerRegistration', component: OwnerRegistration },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    component: LoggedUser,
    children: [
      { path: 'home', component: Home },
      { path: 'kioskRegister', component: KioskRegisterPage },
      { path: 'employeeRegister', component: EmployeeRegisterPage },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
