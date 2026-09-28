import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformEmailForRecovery } from './inform-email-for-recovery';

describe('InformEmailForRecovery', () => {
  let component: InformEmailForRecovery;
  let fixture: ComponentFixture<InformEmailForRecovery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformEmailForRecovery],
    }).compileComponents();

    fixture = TestBed.createComponent(InformEmailForRecovery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
