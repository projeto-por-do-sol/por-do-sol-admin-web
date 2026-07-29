import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskGrid } from './kiosk-grid';

describe('KioskGrid', () => {
  let component: KioskGrid;
  let fixture: ComponentFixture<KioskGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(KioskGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
