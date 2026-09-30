import { TestBed } from '@angular/core/testing';

import { UserService } from './user-service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    sessionStorage.removeItem('apollo-mock-session');
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    sessionStorage.removeItem('apollo-mock-session');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('restores the mock user after a reload and clears it on logout', () => {
    service.login();

    const reloadedService = new UserService();
    expect(reloadedService.user()?.name).toBe('Nome do Usuário');

    reloadedService.logout();
    expect(new UserService().user()).toBeNull();
  });
});
