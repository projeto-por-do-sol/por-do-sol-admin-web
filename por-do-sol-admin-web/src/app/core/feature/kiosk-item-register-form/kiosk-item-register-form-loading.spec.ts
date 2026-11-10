import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { KioskItemRegisterForm } from './kiosk-item-register-form';
import { KioskItemService } from '../../services/kiosk-item-service';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { KioskService } from '../../services/kiosk-service';
import { NotificationService } from '../../services/notification-service';
import { PermissionService } from '../../services/permission-service';

describe('KioskItemRegisterForm enquanto carrega o cardápio', () => {
  let fixture: ComponentFixture<KioskItemRegisterForm>;
  const loadCatalog = vi.fn<() => Promise<void>>();
  const element = () => fixture.nativeElement as HTMLElement;
  const realForm = () => element().querySelector('form')!.parentElement!;

  beforeEach(() => {
    loadCatalog.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: KioskService, useValue: { kiosks: signal([]) } },
        { provide: KioskSelectionService, useValue: { selectedKiosk: signal(null), selectedKioskId: signal(null) } },
        { provide: KioskItemService, useValue: { loadCatalog, categories: signal({}) } },
        { provide: PermissionService, useValue: { isOwner: signal(true) } },
        { provide: NotificationService, useValue: { success: vi.fn(), error: vi.fn() } },
      ],
    });
  });

  async function render() {
    fixture = TestBed.createComponent(KioskItemRegisterForm);
    await fixture.whenStable();
  }

  it('mostra o skeleton e mantém o formulário montado, mas oculto', async () => {
    loadCatalog.mockReturnValue(new Promise(() => undefined));
    await render();

    expect(element().querySelector('[role="status"]')?.textContent).toContain('Carregando cardápio...');
    expect(element().querySelector('app-form-skeleton')).toBeTruthy();
    expect(realForm().classList.contains('hidden')).toBe(true);
  });

  it('mostra o formulário quando o cardápio chega', async () => {
    loadCatalog.mockResolvedValue(undefined);
    await render();

    expect(element().querySelector('app-form-skeleton')).toBeNull();
    expect(realForm().classList.contains('hidden')).toBe(false);
  });

  it('mostra o erro e o formulário desabilitado quando a API falha', async () => {
    loadCatalog.mockRejectedValue(new Error('falhou'));
    await render();

    expect(element().querySelector('[role="alert"]')).toBeTruthy();
    expect(element().querySelector('app-form-skeleton')).toBeNull();
    expect(realForm().classList.contains('hidden')).toBe(false);
    expect(element().querySelector('fieldset')!.disabled).toBe(true);
  });
});
