import { Component } from '@angular/core';
import { ReturnLink } from "../../shared/ui/return-link/return-link";
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { CardPreview } from "../../shared/ui/card-preview/card-preview";
import { EmployeeRegisterForm } from '../../feature/employee-register-form/employee-register-form';
import { Router } from '@angular/router';



@Component({
  selector: 'app-employee-register-page',
  imports: [ReturnLink, SectionTitle, CardPreview, EmployeeRegisterForm],
  templateUrl: './employee-register-page.html',
  styleUrl: './employee-register-page.css',
})
export class EmployeeRegisterPage {

  constructor(private router: Router) { }

  goToHome() {
    this.router.navigate(['/'])
  }

}
