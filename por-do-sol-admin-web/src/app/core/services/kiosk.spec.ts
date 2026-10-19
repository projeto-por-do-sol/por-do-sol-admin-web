import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { KioskService } from './kiosk-service';

describe('KioskService', () => {
  let service: KioskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(KioskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
