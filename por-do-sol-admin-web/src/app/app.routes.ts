import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { sessionKioskGuard } from './core/guards/session-kiosk-guard';

// As telas são carregadas sob demanda para manter o bundle inicial dentro do budget do angular.json.
const ownerRegistration = () => import('./core/layout/owner-registration/owner-registration').then(m => m.OwnerRegistration)
const kioskRegisterPage = () => import('./core/layout/kiosk-register-page/kiosk-register-page').then(m => m.KioskRegisterPage)
const employeeRegisterPage = () => import('./core/layout/employee-register-page/employee-register-page').then(m => m.EmployeeRegisterPage)
const kioskItemRegisterPage = () => import('./core/layout/kiosk-item-register-page/kiosk-item-register-page').then(m => m.KioskItemRegisterPage)

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./core/layout/login/login').then(m => m.Login) },
  { path: 'ownerRegistration', loadComponent: ownerRegistration },
  { path: 'informEmailForRecovery', loadComponent: () => import('./core/layout/inform-email-for-recovery/inform-email-for-recovery').then(m => m.InformEmailForRecovery) },
  { path: 'passwordRecovery', loadComponent: () => import('./core/layout/password-recovery/password-recovery').then(m => m.PasswordRecovery) },
  { path: 'passwordReset', loadComponent: () => import('./core/layout/password-reset/password-reset').then(m => m.PasswordReset) },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    loadComponent: () => import('./core/layout/logged-user/logged-user').then(m => m.LoggedUser),
    canActivate: [authGuard, sessionKioskGuard],
    children: [
      { path: 'home', loadComponent: () => import('./core/layout/home/home').then(m => m.Home) },
      { path: 'kioskRegister', loadComponent: kioskRegisterPage, canActivate: [roleGuard], data: { minRole: 'proprietario' } },
      { path: 'kioskRegister/:id', loadComponent: kioskRegisterPage, canActivate: [roleGuard], data: { minRole: 'gerente' } },
      { path: 'employeeRegister', loadComponent: employeeRegisterPage, canActivate: [roleGuard], data: { minRole: 'gerente' } },
      { path: 'employeeRegister/:id', loadComponent: employeeRegisterPage, canActivate: [roleGuard], data: { minRole: 'gerente' } },
      { path: 'itemRegister', loadComponent: kioskItemRegisterPage },
      { path: 'itemRegister/:id', loadComponent: kioskItemRegisterPage },
      { path: 'createOrder', loadComponent: () => import('./core/layout/create-order/create-order').then(m => m.CreateOrder) },
      { path: 'help', loadComponent: () => import('./core/layout/help/help').then(m => m.Help) },
      { path: 'editProfile', loadComponent: ownerRegistration, canActivate: [roleGuard], data: { minRole: 'proprietario', editMode: true } },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
