import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Team } from './team';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { TeamService } from '../../services/team-service';

describe('Team', () => {
  let component: Team;
  let fixture: ComponentFixture<Team>;
  const team = signal([{ id: 'a', name: 'Rodolfo da Silva', role: 'Gerente', kioskName: 'Praia', startShift: '08:00', finishShift: '18:00', status: true }]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Team],
      providers: [provideRouter([]), { provide: TeamService, useValue: { team, loadTeam: () => Promise.resolve() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(Team);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the editor for the employee selected in the table', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const button = fixture.nativeElement.querySelector('[aria-label="Editar Rodolfo da Silva"]') as HTMLButtonElement;

    expect(button).toBeTruthy();
    button.click();

    expect(navigate).toHaveBeenCalledWith(['/employeeRegister', 'a']);
  });
});
