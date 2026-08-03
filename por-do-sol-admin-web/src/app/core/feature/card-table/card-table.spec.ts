import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTable } from './card-table';

describe('CardTable', () => {
  let component: CardTable;
  let fixture: ComponentFixture<CardTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTable],
    }).compileComponents();

    fixture = TestBed.createComponent(CardTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
