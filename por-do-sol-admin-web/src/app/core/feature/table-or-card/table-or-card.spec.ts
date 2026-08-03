import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOrCard } from './table-or-card';

describe('TableOrCard', () => {
  let component: TableOrCard;
  let fixture: ComponentFixture<TableOrCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableOrCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TableOrCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
