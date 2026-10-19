import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTable } from './card-table';

describe('CardTable', () => {
  let component: CardTable<unknown>;
  let fixture: ComponentFixture<CardTable<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTable],
    }).compileComponents();

    fixture = TestBed.createComponent(CardTable<unknown>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ELEMENT_DATA', []);
    fixture.componentRef.setInput('cardTemplate', null);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
