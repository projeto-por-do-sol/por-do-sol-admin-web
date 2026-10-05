import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRegisterPage } from './employee-register-page';
import { provideRouter } from '@angular/router';

describe('EmployeeRegisterPage', () => {
  let component: EmployeeRegisterPage;
  let fixture: ComponentFixture<EmployeeRegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRegisterPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeRegisterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
