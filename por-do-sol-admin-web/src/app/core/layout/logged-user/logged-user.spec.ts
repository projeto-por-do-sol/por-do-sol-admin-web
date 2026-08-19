import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedUser } from './logged-user';

describe('LoggedUser', () => {
  let component: LoggedUser;
  let fixture: ComponentFixture<LoggedUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggedUser],
    }).compileComponents();

    fixture = TestBed.createComponent(LoggedUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
