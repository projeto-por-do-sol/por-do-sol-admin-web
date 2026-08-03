import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskRegisterForm } from './kiosk-register-form';

describe('KioskRegisterForm', () => {
  let component: KioskRegisterForm;
  let fixture: ComponentFixture<KioskRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskRegisterForm],
    }).compileComponents();

    fixture = TestBed.createComponent(KioskRegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
