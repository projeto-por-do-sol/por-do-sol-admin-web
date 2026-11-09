import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Home } from './home';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { KioskService } from '../../services/kiosk-service';
import { PermissionService } from '../../services/permission-service';
import { NavigationService } from '../../services/navigation-service';
import { Skeleton } from '../../shared/ui/skeleton/skeleton';

describe('Home enquanto carrega os quiosques do proprietário', () => {
  let fixture: ComponentFixture<Home>;
  const loaded = signal(false);
  const ensureKiosks = vi.fn<() => Promise<void>>();
  const element = () => fixture.nativeElement as HTMLElement;

  beforeEach(() => {
    loaded.set(false);
    ensureKiosks.mockReset();
    // As seções têm os próprios testes; aqui só importa qual estado da Home aparece.
    TestBed.overrideComponent(Home, { set: { imports: [Skeleton], schemas: [CUSTOM_ELEMENTS_SCHEMA] } });
    TestBed.configureTestingModule({
      providers: [
        { provide: KioskService, useValue: { loaded, kiosks: signal([{ id: '1' }]), ensureKiosks } },
        { provide: KioskSelectionService, useValue: { selectedKiosk: signal(null) } },
        { provide: NavigationService, useValue: {} },
        {
          provide: PermissionService,
          useValue: { isOwner: signal(true), canViewOverview: signal(true), canViewStatistics: signal(true), canViewTeam: signal(true) },
        },
      ],
    });
  });

  async function render() {
    fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
  }

  it('mostra o skeleton sem criar as seções usadas na navegação', async () => {
    ensureKiosks.mockReturnValue(new Promise(() => undefined));
    await render();

    expect(element().querySelector('main [role="status"]')?.textContent).toContain('Carregando painel...');
    expect(element().querySelector('#visao-geral')).toBeNull();
  });

  it('troca o skeleton pelas seções quando os quiosques carregam', async () => {
    ensureKiosks.mockResolvedValue(undefined);
    await render();

    loaded.set(true);
    await fixture.whenStable();

    expect(element().querySelector('main [role="status"]')).toBeNull();
    expect(element().querySelector('#visao-geral')).toBeTruthy();
  });

  it('mostra o erro em vez de carregar para sempre e permite tentar novamente', async () => {
    ensureKiosks.mockRejectedValueOnce(new Error('falhou'));
    await render();

    const alert = element().querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Não foi possível carregar seus quiosques.');
    expect(element().querySelector('main [role="status"]')).toBeNull();

    ensureKiosks.mockReturnValue(new Promise(() => undefined));
    alert!.querySelector('button')!.click();
    await fixture.whenStable();

    expect(ensureKiosks).toHaveBeenCalledTimes(2);
    expect(element().querySelector('[role="alert"]')).toBeNull();
    expect(element().querySelector('main [role="status"]')).toBeTruthy();
  });
});
