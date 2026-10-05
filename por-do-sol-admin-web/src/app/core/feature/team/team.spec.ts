import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Team } from './team';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('Team', () => {
  let component: Team;
  let fixture: ComponentFixture<Team>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Team],
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

    expect(navigate).toHaveBeenCalledWith(['/employeeRegister', 'employee1']);
  });
});
