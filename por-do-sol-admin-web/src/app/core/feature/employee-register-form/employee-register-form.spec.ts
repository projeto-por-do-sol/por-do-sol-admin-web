import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRegisterForm } from './employee-register-form';
import { TeamService } from '../../services/team-service';
import { vi } from 'vitest';

describe('EmployeeRegisterForm', () => {
  let component: EmployeeRegisterForm;
  let fixture: ComponentFixture<EmployeeRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRegisterForm],
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
    const employee = teamService.getEmployee('employee1')!;
    fixture.componentRef.setInput('employee', employee);
    await fixture.whenStable();

    expect(component.formFields.value.name).toBe(employee.name);
    expect(component.formFields.value.email).toBe(employee.email);
    expect(component.formFields.value.phone).toBe(employee.phone);
    expect(component.kiosk()).toBe(employee.kioskName);
    expect(component.role()).toBe(employee.role);
    expect(component.selectedDays()).toEqual(employee.daysShift);
    expect((fixture.nativeElement.querySelector('input[name="name"]') as HTMLInputElement).value).toBe(employee.name);
    expect((fixture.nativeElement.querySelector('input[name="email"]') as HTMLInputElement).value).toBe(employee.email);
    expect(fixture.nativeElement.querySelectorAll('.selected-chip').length).toBe(employee.daysShift?.length);

    component.formFields.patchValue({ name: 'Rodolfo Editado' });
    component.setDaysShift(['Domingo']);
    component.onSubmit();

    expect(teamService.getEmployee(employee.id!)?.name).toBe('Rodolfo Editado');
    expect(teamService.getEmployee(employee.id!)?.daysShift).toEqual(['Domingo']);
    expect(teamService.team().length).toBe(7);
  });

  it('keeps the registration flow usable', async () => {
    const teamService = TestBed.inject(TeamService);
    component.formFields.patchValue({
      name: 'Novo Funcionário',
      email: 'novo@example.com',
      phone: '(13) 99999-0010',
    });
    await fixture.whenStable();
    component.onSubmit();

    expect(teamService.team().some(employee => employee.name === 'Novo Funcionário')).toBe(true);
  });

  it('shows removal only while editing and requires confirmation', async () => {
    expect(fixture.nativeElement.querySelector('form button[aria-label="Remover funcionário da equipe"]')).toBeNull();

    const service = TestBed.inject(TeamService);
    const employee = service.getEmployee('employee1')!;
    const removed = vi.fn();
    component.removed.subscribe(removed);
    fixture.componentRef.setInput('employee', employee);
    await fixture.whenStable();

    const dialog = fixture.nativeElement.querySelector('#remove-employee-title')?.closest('dialog') as HTMLDialogElement;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();
    const openButton = fixture.nativeElement.querySelector('form button[aria-label="Remover funcionário da equipe"]') as HTMLButtonElement;
    openButton.click();
    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(service.getEmployee(employee.id!)).toBeTruthy();

    (dialog.querySelector('app-cancel-button button') as HTMLButtonElement).click();
    expect(service.getEmployee(employee.id!)).toBeTruthy();
    expect(removed).not.toHaveBeenCalled();

    openButton.click();
    (dialog.querySelector('button[aria-label="Confirmar remoção do funcionário"]') as HTMLButtonElement).click();
    expect(service.getEmployee(employee.id!)).toBeUndefined();
    expect(removed).toHaveBeenCalledOnce();
  });
});
