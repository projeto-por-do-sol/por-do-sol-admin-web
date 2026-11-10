import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { EmployeeRegisterPage } from './employee-register-page';
import { TeamService } from '../../services/team-service';
import { FormSkeleton } from '../../shared/ui/form-skeleton/form-skeleton';
import { CardPreviewSkeleton } from '../../shared/ui/card-preview-skeleton/card-preview-skeleton';

@Component({ selector: 'app-employee-register-form', template: '' })
class EmployeeRegisterFormStub {
  previewName = () => ''
  previewItems = () => []
  previewRole = () => ''
  previewLastText = ''
}

describe('EmployeeRegisterPage enquanto carrega', () => {
  let fixture: ComponentFixture<EmployeeRegisterPage>;
  const loadTeam = vi.fn<() => Promise<void>>();
  const element = () => fixture.nativeElement as HTMLElement;

  beforeEach(() => {
    loadTeam.mockReset();
    TestBed.overrideComponent(EmployeeRegisterPage, {
      set: { imports: [FormSkeleton, CardPreviewSkeleton, EmployeeRegisterFormStub], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'a' }) } } },
        { provide: TeamService, useValue: { loadTeam, getEmployee: () => ({ id: 'a', name: 'Bia' }) } },
      ],
    });
  });

  async function render() {
    fixture = TestBed.createComponent(EmployeeRegisterPage);
    await fixture.whenStable();
  }

  it('mostra o skeleton do formulário e do preview no lugar do formulário', async () => {
    loadTeam.mockReturnValue(new Promise(() => undefined));
    await render();

    expect(element().querySelector('[role="status"]')?.textContent).toContain('Carregando formulário...');
    expect(element().querySelector('app-form-skeleton')).toBeTruthy();
    expect(element().querySelector('app-card-preview-skeleton')).toBeTruthy();
    expect(element().querySelector('app-employee-register-form')).toBeNull();
  });

  it('troca o skeleton pelo formulário quando os dados chegam', async () => {
    loadTeam.mockResolvedValue(undefined);
    await render();

    expect(element().querySelector('app-form-skeleton')).toBeNull();
    expect(element().querySelector('app-employee-register-form')).toBeTruthy();
  });

  it('mostra o erro no lugar do skeleton quando a API falha', async () => {
    loadTeam.mockRejectedValue(new Error('falhou'));
    await render();

    expect(element().querySelector('[role="alert"]')).toBeTruthy();
    expect(element().querySelector('app-form-skeleton')).toBeNull();
  });
});
