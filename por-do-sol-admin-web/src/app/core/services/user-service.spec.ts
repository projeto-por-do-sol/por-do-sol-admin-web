import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../config/api';
import { authInterceptor } from '../interceptors/auth-interceptor';
import { UserService } from './user-service';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('authenticates, stores the token and loads the current user', () => {
    let userName: string | undefined;

    service.login({ email: 'gestor@apollo.com', password: 'senha' }).subscribe(user => {
      userName = user.name;
    });

    const loginRequest = http.expectOne(`${API_BASE_URL}/auth/login/quiosque`);
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.body).toEqual({ email: 'gestor@apollo.com', password: 'senha' });
    loginRequest.flush({ token: 'jwt-token' });

    const meRequest = http.expectOne(`${API_BASE_URL}/me`);
    expect(meRequest.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    meRequest.flush({
      id: 'user-id',
      nome: 'Maria Gestora',
      email: 'gestor@apollo.com',
      telefone: '11999999999',
      dataCadastro: '2026-10-08',
      imagem: null,
      role: 'gerente',
    });

    expect(sessionStorage.getItem('apollo-token')).toBe('jwt-token');
    expect(userName).toBe('Maria Gestora');
    expect(service.user()?.position).toBe('Gerente');
  });

  it('restores a remembered session from local storage', () => {
    localStorage.setItem('apollo-token', 'remembered-token');

    service.restoreSession().subscribe();

    const meRequest = http.expectOne(`${API_BASE_URL}/me`);
    expect(meRequest.request.headers.get('Authorization')).toBe('Bearer remembered-token');
    meRequest.flush({
      id: 'user-id',
      nome: 'João Proprietário',
      email: 'joao@apollo.com',
      telefone: '11999999999',
      dataCadastro: '2026-10-08',
      imagem: null,
      role: 'proprietario',
    });

    expect(service.user()?.name).toBe('João Proprietário');
  });

  it('clears both storage types on logout', () => {
    sessionStorage.setItem('apollo-token', 'session-token');
    localStorage.setItem('apollo-token', 'persistent-token');

    service.logout();

    expect(sessionStorage.getItem('apollo-token')).toBeNull();
    expect(localStorage.getItem('apollo-token')).toBeNull();
    expect(service.user()).toBeNull();
  });
});
