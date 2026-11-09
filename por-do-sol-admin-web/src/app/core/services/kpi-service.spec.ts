import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { KpiService } from './kpi-service';
import { KioskSelectionService } from './kiosk-selection-service';
import { KioskService } from './kiosk-service';
import { UserService } from './user-service';
import { API_BASE_URL } from '../config/api';

describe('KpiService', () => {
  let service: KpiService;
  let http: HttpTestingController;
  const user = signal<{ role: string } | null>({ role: 'proprietario' });
  const selectedKioskId = signal<string | null>(null);

  beforeEach(() => {
    user.set({ role: 'proprietario' });
    selectedKioskId.set(null);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), provideHttpClientTesting(),
        { provide: UserService, useValue: { user } },
        { provide: KioskSelectionService, useValue: { selectedKioskId } },
        { provide: KioskService, useValue: { kiosks: signal([{ id: '7' }]).asReadonly(), ensureKiosks: () => Promise.resolve() } },
      ],
    });
    service = TestBed.inject(KpiService);
    http = TestBed.inject(HttpTestingController);
  });

  const summary = {
    pedidosHoje: 30, varPedidos: 50, faturamentoHoje: 900, varFaturamento: 12.5,
    ticketMedio: 30, varTicket: -25, tempoMedio: 15, varTempo: 25, varTempoMinutos: 3,
  };

  async function flushNext(url: string, body: object) {
    await Promise.resolve(); await Promise.resolve();
    http.expectOne(url).flush(body);
  }

  it('usa o resumo da empresa para o proprietário', async () => {
    const loading = service.loadKpi();
    await flushNext(`${API_BASE_URL}/empresas/me/overview/resumo`, summary);
    await loading;

    const kpis = service.kpi();
    expect(kpis.map(k => k.lable)).toEqual(['Pedidos hoje', 'Faturamento hoje', 'Ticket médio', 'Tempo médio']);
    expect(kpis[0].value).toBe('30');
    expect(kpis[0].variation).toBe('50%');
    expect(kpis[0].direction).toBe(true);
    expect(kpis[2].direction).toBe(false);
    expect(kpis[3].value).toBe('15 min');
    expect(kpis[3].variation).toBe('3 min');
    // Tempo maior que ontem é ruim, apesar de a seta subir.
    expect(kpis[3].direction).toBe(true);
    expect(kpis[3].good).toBe(false);
  });

  it('usa o overview do quiosque para o gerente', async () => {
    user.set({ role: 'gerente' });
    const { varTempoMinutos, ...managerSummary } = summary;

    const loading = service.loadKpi();
    await flushNext(`${API_BASE_URL}/quiosques/7/overview`, { quiosques: [managerSummary] });
    await loading;

    expect(service.kpi()[3].variation).toBe('25%');
    expect(service.failed()).toBe(false);
  });

  it('usa o overview do quiosque selecionado, mesmo para o proprietário', async () => {
    selectedKioskId.set('3');

    const loading = service.loadKpi();
    await flushNext(`${API_BASE_URL}/quiosques/3/overview`, { quiosques: [summary] });
    await loading;

    expect(service.kpi()[3].variation).toBe('3 min');
  });

  it('ignora a resposta de uma seleção antiga', async () => {
    selectedKioskId.set('3');
    const first = service.loadKpi();
    await Promise.resolve(); await Promise.resolve();
    const stale = http.expectOne(`${API_BASE_URL}/quiosques/3/overview`);

    selectedKioskId.set(null);
    const second = service.loadKpi();
    await flushNext(`${API_BASE_URL}/empresas/me/overview/resumo`, { ...summary, pedidosHoje: 99 });
    await second;
    stale.flush({ quiosques: [{ ...summary, pedidosHoje: 1 }] });
    await first;

    expect(service.kpi()[0].value).toBe('99');
  });

  it('marca falha e limpa os KPIs quando a API erra', async () => {
    const loading = service.loadKpi();
    await Promise.resolve(); await Promise.resolve();
    http.expectOne(`${API_BASE_URL}/empresas/me/overview/resumo`).flush({}, { status: 500, statusText: 'Erro' });
    await loading;

    expect(service.failed()).toBe(true);
    expect(service.kpi()).toEqual([]);
    expect(service.loading()).toBe(false);
  });

  describe('estado de carregamento', () => {
    const companyUrl = `${API_BASE_URL}/empresas/me/overview/resumo`;

    async function loadCompany() {
      const loading = service.loadKpi();
      await flushNext(companyUrl, summary);
      await loading;
    }

    it('fica carregando até a primeira resposta chegar', async () => {
      expect(service.loading()).toBe(true);
      await loadCompany();
      expect(service.loading()).toBe(false);
    });

    it('mantém os KPIs na tela ao atualizar o mesmo quiosque', async () => {
      await loadCompany();

      const refresh = service.loadKpi();
      expect(service.loading()).toBe(false);
      expect(service.kpi().length).toBe(4);

      await flushNext(companyUrl, summary);
      await refresh;
    });

    it('não mantém os KPIs do quiosque anterior ao trocar de quiosque', async () => {
      await loadCompany();

      selectedKioskId.set('3');
      const next = service.loadKpi();
      expect(service.kpi()).toEqual([]);
      expect(service.loading()).toBe(true);

      await flushNext(`${API_BASE_URL}/quiosques/3/overview`, { quiosques: [summary] });
      await next;
      expect(service.loading()).toBe(false);
    });

    it('volta a carregar ao tentar novamente depois de uma falha', async () => {
      const failed = service.loadKpi();
      await Promise.resolve(); await Promise.resolve();
      http.expectOne(companyUrl).flush({}, { status: 500, statusText: 'Erro' });
      await failed;

      const retry = service.loadKpi();
      expect(service.loading()).toBe(true);
      await flushNext(companyUrl, summary);
      await retry;
      expect(service.loading()).toBe(false);
    });
  });
});
