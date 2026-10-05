import { Component, inject } from '@angular/core';
import { ReturnLink } from "../../shared/ui/return-link/return-link";
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { CardPreview } from "../../shared/ui/card-preview/card-preview";
import { EmployeeRegisterForm } from '../../feature/employee-register-form/employee-register-form';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../services/team-service';



@Component({
  selector: 'app-employee-register-page',
  imports: [ReturnLink, SectionTitle, CardPreview, EmployeeRegisterForm],
  templateUrl: './employee-register-page.html',
  styleUrl: './employee-register-page.css',
})
export class EmployeeRegisterPage {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly teamService = inject(TeamService)
  readonly employeeId = this.route.snapshot.paramMap.get('id')
  readonly employee = this.employeeId ? this.teamService.getEmployee(this.employeeId) : null

  goToHome() {
    this.router.navigate(['/home'])
  }

}
