import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRegisterForm } from './employee-register-form';

describe('EmployeeRegisterForm', () => {
  let component: EmployeeRegisterForm;
  let fixture: ComponentFixture<EmployeeRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRegisterForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeRegisterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
