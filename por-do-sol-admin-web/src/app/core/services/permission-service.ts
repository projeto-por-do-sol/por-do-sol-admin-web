import { computed, inject, Injectable } from '@angular/core';
import { UserService } from './user-service';

export type UserRole = 'proprietario' | 'gerente' | 'funcionario'

// Mesma hierarquia das authorities do backend: proprietário > gerente > funcionário.
const RANK: Record<UserRole, number> = {
  funcionario: 1,
  gerente: 2,
  proprietario: 3,
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly userService = inject(UserService)

  readonly role = computed(() => (this.userService.user()?.role ?? null) as UserRole | null)

  readonly isOwner = computed(() => this.role() === 'proprietario')

  readonly canSelectKiosk = this.isOwner
  readonly canRegisterKiosk = this.isOwner
  readonly canDeleteKiosk = this.isOwner

  readonly canViewOverview = computed(() => this.atLeast('gerente'))
  readonly canViewStatistics = this.canViewOverview
  readonly canViewTeam = this.canViewOverview
  readonly canEditKiosk = this.canViewOverview
  readonly canRegisterEmployee = this.canViewOverview

  atLeast(minimum: UserRole): boolean {
    const role = this.role()
    return !!role && RANK[role] >= RANK[minimum]
  }
}
