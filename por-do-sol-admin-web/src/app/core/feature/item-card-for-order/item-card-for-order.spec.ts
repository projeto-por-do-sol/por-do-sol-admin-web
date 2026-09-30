import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardForOrder } from './item-card-for-order';

describe('ItemCardForOrder', () => {
  let component: ItemCardForOrder;
  let fixture: ComponentFixture<ItemCardForOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCardForOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCardForOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the quantity between 0 and 99', () => {
    component.decreaseQuantity();
    expect(component.quantity()).toBe(0);

    for (let count = 0; count < 100; count++) component.increaseQuantity();
    expect(component.quantity()).toBe(99);

    component.decreaseQuantity();
    expect(component.quantity()).toBe(98);
  });
});
