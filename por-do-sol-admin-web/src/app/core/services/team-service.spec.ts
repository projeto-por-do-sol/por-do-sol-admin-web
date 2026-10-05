import { TestBed } from '@angular/core/testing';

import { TeamService } from './team-service';

describe('TeamService', () => {
  let service: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('finds and updates an employee without replacing the other records', () => {
    const original = service.getEmployee('employee1');
    expect(original?.name).toBe('Rodolfo da Silva');

    expect(service.updateEmployee('employee1', {
      name: 'Rodolfo Atualizado',
      kioskName: 'Praia Quiosque',
      daysShift: ['Sábado'],
    })).toBe(true);

    expect(service.getEmployee('employee1')).toEqual({
      ...original,
      name: 'Rodolfo Atualizado',
      kioskName: 'Praia Quiosque',
      daysShift: ['Sábado'],
    });
    expect(service.getEmployee('employee2')?.name).toBe('Mariana Costa');
    expect(service.updateEmployee('missing', { name: 'Ninguém' })).toBe(false);
  });
});
