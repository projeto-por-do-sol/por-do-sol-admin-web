import { TestBed } from '@angular/core/testing';

import { KioskSelectionService } from './kiosk-selection-service';

describe('KioskSelectionService', () => {
  let service: KioskSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KioskSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
