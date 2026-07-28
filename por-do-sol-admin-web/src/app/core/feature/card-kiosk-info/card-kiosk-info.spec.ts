import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardKioskInfo } from './card-kiosk-info';

describe('CardKioskInfo', () => {
  let component: CardKioskInfo;
  let fixture: ComponentFixture<CardKioskInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardKioskInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(CardKioskInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
