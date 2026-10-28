import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { KpiCard } from './kpi-card';
import { KioskSelectionService } from '../../../services/kiosk-selection-service';
import { KpiService } from '../../../services/kpi-service';
import { KpiModel } from '../../../models/kpi-model';

describe('KpiCard', () => {
  let component: KpiCard;
  let fixture: ComponentFixture<KpiCard>;
  const loadKpi = vi.fn();
  const failed = signal(false);
  const selectedKioskId = signal<string | null>(null);

  beforeEach(async () => {
    loadKpi.mockClear();
    failed.set(false);
    selectedKioskId.set(null);
    await TestBed.configureTestingModule({
      imports: [KpiCard],
      providers: [
        {
          provide: KpiService,
          useValue: { kpi: signal([new KpiModel('Pedidos hoje', '30', '50%', true)]).asReadonly(), failed, loadKpi },
        },
        { provide: KioskSelectionService, useValue: { selectedKioskId } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carrega os KPIs ao iniciar e mostra o valor', () => {
    expect(loadKpi).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('30');
  });

  it('recarrega os KPIs quando outro quiosque é selecionado', async () => {
    loadKpi.mockClear();

    selectedKioskId.set('2');
    await fixture.whenStable();

    expect(loadKpi).toHaveBeenCalledTimes(1);
  });

  it('oferece nova tentativa quando o carregamento falha', async () => {
    failed.set(true);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(loadKpi).toHaveBeenCalledTimes(2);
  });
});
