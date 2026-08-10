import { Routes } from '@angular/router';
import { Home } from './core/layout/home/home';
import { KioskRegisterPage } from './core/layout/kiosk-register-page/kiosk-register-page';
import { EmployeeRegisterPage } from './core/layout/employee-register-page/employee-register-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'kioskRegister', component: KioskRegisterPage },
  { path: 'employeeRegister', component: EmployeeRegisterPage },
];
