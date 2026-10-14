import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TeamService } from './team-service';
import { KioskService } from './kiosk-service';
import { API_BASE_URL } from '../config/api';

describe('TeamService', () => {
  let service: TeamService;
  let http: HttpTestingController;
  const kiosk = { id: '1', name: 'Praia' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), provideHttpClientTesting(),
        { provide: KioskService, useValue: { kiosks: signal([kiosk]).asReadonly(), loadKiosks: () => Promise.resolve() } },
      ],
    });
    service = TestBed.inject(TeamService);
    http = TestBed.inject(HttpTestingController);
  });

  async function load() {
    const loading = service.loadTeam();
    await Promise.resolve(); await Promise.resolve();
    http.expectOne(`${API_BASE_URL}/quiosques/1/funcionarios`).flush([
      { id: 'a', quiosqueId: 1, nome: 'Ana', email: 'ana.1', role: 'GERENTE', telefone: '1', imagem: null, startShift: '08:00:00', finishShift: '18:00:00' },
    ]);
    await loading;
  }

  it('loads the team of every kiosk from the API', async () => {
    await load();
    expect(service.team()).toEqual([jasmineLike({ id: 'a', name: 'Ana', role: 'Gerente', kioskName: 'Praia', startShift: '08:00', finishShift: '18:00' })]);
  });

  it('creates an employee through the API', async () => {
    const created = service.addEmployee({ name: 'Bia', email: 'b@x.com', phone: '2', role: 'Funcionário', kioskId: '1', kioskName: 'Praia', startShift: '08:00', finishShift: '12:00', daysShift: ['Segunda', 'Domingo'] });
    const req = http.expectOne(`${API_BASE_URL}/quiosques/1/funcionarios`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toMatchObject({ nome: 'Bia', role: 'FUNCIONARIO', startShift: '08:00', finishShift: '12:00', telefone: '2', diasTurno: [true, true, false, false, false, false, false] });
    expect(req.request.body.password).toBeUndefined();
    req.flush({ id: 'b', nome: 'Bia' });
    await created;
    expect(service.getEmployee('b')?.name).toBe('Bia');
  });

  it('removes an employee after the API confirms', async () => {
    await load();
    const removing = service.removeEmployee('a');
    const req = http.expectOne(`${API_BASE_URL}/quiosques/1/funcionarios/a`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await removing;
    expect(service.getEmployee('a')).toBeUndefined();
  });
});

function jasmineLike(partial: object) { return expect.objectContaining(partial) }
