import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRegisterPage } from './employee-register-page';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { TeamService } from '../../services/team-service';
import { KioskService } from '../../services/kiosk-service';

describe('EmployeeRegisterPage', () => {
  let component: EmployeeRegisterPage;
  let fixture: ComponentFixture<EmployeeRegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRegisterPage],
      providers: [
        provideRouter([]),
        { provide: TeamService, useValue: { loadTeam: () => Promise.resolve(), getEmployee: () => undefined } },
        { provide: KioskService, useValue: { kiosks: signal([]).asReadonly() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeRegisterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
