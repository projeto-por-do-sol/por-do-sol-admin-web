import { Component, computed, inject, signal } from '@angular/core';
import { ReturnLink } from "../../shared/ui/return-link/return-link";
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { CardPreview } from "../../shared/ui/card-preview/card-preview";
import { EMPLOYEE_FORM_SKELETON, EmployeeRegisterForm } from '../../feature/employee-register-form/employee-register-form';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../services/team-service';
import { FormSkeleton } from '../../shared/ui/form-skeleton/form-skeleton';
import { CardPreviewSkeleton } from '../../shared/ui/card-preview-skeleton/card-preview-skeleton';



@Component({
  selector: 'app-employee-register-page',
  imports: [ReturnLink, SectionTitle, CardPreview, EmployeeRegisterForm, FormSkeleton, CardPreviewSkeleton],
  templateUrl: './employee-register-page.html',
  styleUrl: './employee-register-page.css',
})
export class EmployeeRegisterPage {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly teamService = inject(TeamService)
  readonly employeeId = this.route.snapshot.paramMap.get('id')
  readonly employee = computed(() => this.employeeId ? this.teamService.getEmployee(this.employeeId) ?? null : null)
  readonly loading = signal(true)
  readonly loadError = signal(false)
  readonly formSkeleton = EMPLOYEE_FORM_SKELETON

  constructor() { void this.loadTeam() }

  async loadTeam(): Promise<void> {
    this.loading.set(true)
    this.loadError.set(false)
    try { await this.teamService.loadTeam() }
    catch { this.loadError.set(true) }
    finally { this.loading.set(false) }
  }

  goToHome() {
    this.router.navigate(['/home'])
  }

}
