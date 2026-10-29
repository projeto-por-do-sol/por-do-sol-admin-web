import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { StatisticsService } from './statistics-service';
import { KioskSelectionService } from './kiosk-selection-service';
import { UserService } from './user-service';
import { API_BASE_URL } from '../config/api';
import { StatisticsResponse } from '../models/statistics-model';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let http: HttpTestingController;
  const user = signal<{ role: string } | null>({ role: 'proprietario' });
  const selectedKioskId = signal<string | null>(null);

  const response: StatisticsResponse = {
    revenueByKiosk: { dates: ['2026-10-01'], kiosks: [{ kioskId: 1, kioskName: 'Centro', revenue: [10] }] },
    topProducts: { products: [] },
    dailyRevenue: { points: [] },
    ordersByCategory: { categories: [] },
    cancellations: { cancelledOrders: 1, totalOrders: 4, rate: 25 },
  };

  beforeEach(() => {
    user.set({ role: 'proprietario' });
    selectedKioskId.set(null);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), provideHttpClientTesting(),
        { provide: UserService, useValue: { user } },
        { provide: KioskSelectionService, useValue: { selectedKioskId } },
      ],
    });
    service = TestBed.inject(StatisticsService);
    http = TestBed.inject(HttpTestingController);
  });

  const statisticsRequest = () =>
    http.expectOne(request => request.url === `${API_BASE_URL}/empresas/me/statistics`);

  it('pede os últimos 7 dias sem quiosque quando nenhum está selecionado', async () => {
    const loading = service.load();
    const request = statisticsRequest();
    const { startDate, endDate } = Object.fromEntries(request.request.params.keys().map(key => [key, request.request.params.get(key)]));
    const days = (new Date(endDate!).getTime() - new Date(startDate!).getTime()) / 86_400_000;
    expect(days).toBe(6);
    expect(request.request.params.has('kioskId')).toBe(false);
    request.flush(response);
    await loading;

    expect(service.statistics()?.cancellations.rate).toBe(25);
    expect(service.failed()).toBe(false);
  });

  it('envia o quiosque selecionado', async () => {
    selectedKioskId.set('7');
    const loading = service.load();
    const request = statisticsRequest();
    expect(request.request.params.get('kioskId')).toBe('7');
    request.flush(response);
    await loading;
  });

  it('marca falha e limpa os dados quando a API erra', async () => {
    const loading = service.load();
    statisticsRequest().flush({}, { status: 500, statusText: 'Server Error' });
    await loading;

    expect(service.statistics()).toBeNull();
    expect(service.failed()).toBe(true);
  });

  it('ignora a resposta de uma requisição substituída por outra mais recente', async () => {
    const first = service.load();
    const firstRequest = statisticsRequest();
    selectedKioskId.set('7');
    const second = service.load();
    const secondRequest = statisticsRequest();

    secondRequest.flush(response);
    await second;
    firstRequest.flush({ ...response, cancellations: { cancelledOrders: 0, totalOrders: 0, rate: 0 } });
    await first;

    expect(service.statistics()?.cancellations.rate).toBe(25);
  });
});
