import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRegisterForm } from './employee-register-form';
import { TeamService } from '../../services/team-service';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { KioskService } from '../../services/kiosk-service';

describe('EmployeeRegisterForm', () => {
  let component: EmployeeRegisterForm;
  let fixture: ComponentFixture<EmployeeRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRegisterForm],
      providers: [
        { provide: KioskService, useValue: { kiosks: signal([{ id: '1', name: 'Praia' }]).asReadonly() } },
        { provide: TeamService, useValue: { addEmployee: vi.fn(), updateEmployee: vi.fn(), removeEmployee: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeRegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('prefills and saves an existing employee', async () => {
    const teamService = TestBed.inject(TeamService);
    const employee = { id: 'a', name: 'Rodolfo', email: 'r@x.com', phone: '(13) 99999-0001', role: 'Gerente', kioskId: '1', kioskName: 'Praia', startShift: '08:00', finishShift: '18:00', daysShift: ['Segunda'] };
    fixture.componentRef.setInput('employee', employee);
    await fixture.whenStable();
    const saved = vi.fn();
    component.saved.subscribe(saved);

    expect(component.formFields.value.name).toBe('Rodolfo');
    expect(component.kiosk()).toBe('Praia');
    expect(component.role()).toBe('Gerente');
    expect(component.selectedDays()).toEqual(['Segunda']);

    component.formFields.patchValue({ name: 'Rodolfo Editado' });
    component.setDaysShift(['Domingo']);
    await component.onSubmit();

    expect(teamService.updateEmployee).toHaveBeenCalledWith('a', expect.objectContaining({ name: 'Rodolfo Editado', kioskId: '1', daysShift: ['Domingo'] }));
    expect(saved).toHaveBeenCalled();
  });

  it('registers a new employee', async () => {
    const teamService = TestBed.inject(TeamService);
    vi.mocked(teamService.addEmployee).mockResolvedValue({ id: 'n', nome: 'Novo Funcionário' });
    const saved = vi.fn();
    component.saved.subscribe(saved);
    component.formFields.patchValue({ name: 'Novo Funcionário', email: 'novo@example.com', phone: '(13) 99999-0010' });
    await fixture.whenStable();
    await component.onSubmit();

    expect(teamService.addEmployee).toHaveBeenCalledWith(expect.objectContaining({ name: 'Novo Funcionário', kioskId: '1', role: 'Funcionário' }));
    expect(saved).toHaveBeenCalled();
  });

  it('does not submit an invalid form', async () => {
    const teamService = TestBed.inject(TeamService);
    await component.onSubmit();
    expect(teamService.addEmployee).not.toHaveBeenCalled();
  });
});
