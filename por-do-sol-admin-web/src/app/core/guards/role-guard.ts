import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService, UserRole } from '../services/permission-service';

// Uso: { path: '...', canActivate: [roleGuard], data: { minRole: 'gerente' } }
export const roleGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionService)
  const router = inject(Router)
  const minRole = route.data['minRole'] as UserRole | undefined

  return !minRole || permissions.atLeast(minRole) ? true : router.createUrlTree(['/home'])
}
