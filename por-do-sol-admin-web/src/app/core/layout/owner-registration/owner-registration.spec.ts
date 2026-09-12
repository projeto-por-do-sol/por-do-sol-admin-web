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
});
