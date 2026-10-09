import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerRegistration } from './owner-registration';

describe('OwnerRegistration', () => {
  let component: OwnerRegistration;
  let fixture: ComponentFixture<OwnerRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerRegistration],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerRegistration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not request a CNPJ from the owner', () => {
    expect(component.formFields.contains('cnpj')).toBe(false);
    expect(fixture.nativeElement.querySelector('[name="cnpj"]')).toBeNull();
  });

  it('requests the owner name instead of a company name', () => {
    expect(component.formFields.contains('ownerName')).toBe(true);
    expect(component.formFields.contains('companyName')).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Nome do proprietário');
  });
});
