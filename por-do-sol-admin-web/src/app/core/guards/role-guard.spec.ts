import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { roleGuard } from './role-guard';
import { PermissionService } from '../services/permission-service';

describe('roleGuard', () => {
  const redirect = {} as UrlTree
  const router = { createUrlTree: vi.fn(() => redirect) }

  function run(role: string, minRole?: string) {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: PermissionService, useValue: { atLeast: (min: string) => ['funcionario', 'gerente', 'proprietario'].indexOf(role) >= ['funcionario', 'gerente', 'proprietario'].indexOf(min) } },
      ],
    })
    const route = { data: { minRole } } as unknown as ActivatedRouteSnapshot
    return TestBed.runInInjectionContext(() => roleGuard(route, {} as never))
  }

  it('permite quando o cargo é suficiente', () => {
    expect(run('gerente', 'gerente')).toBe(true)
    expect(run('proprietario', 'gerente')).toBe(true)
  })

  it('redireciona para /home quando o cargo é insuficiente', () => {
    expect(run('funcionario', 'gerente')).toBe(redirect)
    expect(router.createUrlTree).toHaveBeenCalledWith(['/home'])
  })

  it('permite rota sem minRole', () => {
    expect(run('funcionario')).toBe(true)
  })
})
