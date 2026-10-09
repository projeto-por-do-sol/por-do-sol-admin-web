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

  it('requires a valid CNPJ for the kiosk', () => {
    const cnpj = component.formFields.get('kioskCnpj');

    cnpj?.setValue('11.222.333/0001-82');
    expect(cnpj?.hasError('cnpj')).toBe(true);

    cnpj?.setValue('11.222.333/0001-81');
    expect(cnpj?.valid).toBe(true);
  });

  it('does not request a kiosk phone number', () => {
    expect(component.formFields.contains('kioskPhone')).toBe(false);
    expect(fixture.nativeElement.querySelector('[name="kioskPhone"]')).toBeNull();
  });

  it('stores the location selected on the map', () => {
    component.setLocation({ latitude: -23.9608, longitude: -46.3336 });

    expect(component.formFields.get('latitude')?.value).toBe(-23.9608);
    expect(component.formFields.get('longitude')?.value).toBe(-46.3336);
  });
});
