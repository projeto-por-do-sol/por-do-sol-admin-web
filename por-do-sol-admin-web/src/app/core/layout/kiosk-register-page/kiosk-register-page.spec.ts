import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskRegisterPage } from './kiosk-register-page';

describe('KioskRegisterPage', () => {
  let component: KioskRegisterPage;
  let fixture: ComponentFixture<KioskRegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskRegisterPage],
    }).compileComponents();

    fixture = TestBed.createComponent(KioskRegisterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
