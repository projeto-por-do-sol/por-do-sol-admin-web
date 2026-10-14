import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PermissionService } from './permission-service';
import { UserService } from './user-service';

describe('PermissionService', () => {
  const user = signal<{ role?: string } | null>(null)

  function setup(role: string | null) {
    user.set(role ? { role } : null)
    TestBed.configureTestingModule({ providers: [{ provide: UserService, useValue: { user } }] })
    return TestBed.inject(PermissionService)
  }

  it('libera tudo para o proprietário', () => {
    const p = setup('proprietario')
    expect([p.canSelectKiosk(), p.canRegisterKiosk(), p.canViewOverview(), p.canViewStatistics(),
      p.canViewTeam(), p.canEditKiosk(), p.canRegisterEmployee()]).toEqual(Array(7).fill(true))
  })

  it('gerente vê visão geral, estatísticas e equipe, mas não escolhe nem cadastra quiosque', () => {
    const p = setup('gerente')
    expect([p.canViewOverview(), p.canViewStatistics(), p.canViewTeam(), p.canEditKiosk(), p.canRegisterEmployee()])
      .toEqual(Array(5).fill(true))
    expect([p.canSelectKiosk(), p.canRegisterKiosk()]).toEqual([false, false])
  })

  it('funcionário não tem nenhuma permissão extra', () => {
    const p = setup('funcionario')
    expect([p.canSelectKiosk(), p.canRegisterKiosk(), p.canViewOverview(), p.canViewStatistics(),
      p.canViewTeam(), p.canEditKiosk(), p.canRegisterEmployee()]).toEqual(Array(7).fill(false))
    expect(p.atLeast('funcionario')).toBe(true)
  })

  it('sem usuário nega tudo', () => {
    const p = setup(null)
    expect(p.atLeast('funcionario')).toBe(false)
  })
})
