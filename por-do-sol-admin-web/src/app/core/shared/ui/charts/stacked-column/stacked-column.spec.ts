import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedColumn } from './stacked-column';

describe('StackedColumn', () => {
  let component: StackedColumn;
  let fixture: ComponentFixture<StackedColumn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedColumn],
    }).compileComponents();

    fixture = TestBed.createComponent(StackedColumn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
