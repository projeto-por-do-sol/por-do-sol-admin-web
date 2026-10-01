import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardForOrder } from './item-card-for-order';
import { MOCK_KIOSK_ITEMS } from '../../mocks/mocks';
import { ShoppingCart } from '../../services/shopping-cart';

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
    fixture.componentRef.setInput('item', MOCK_KIOSK_ITEMS[0]);
    fixture.detectChanges();

    component.decreaseQuantity();
    expect(component.quantity()).toBe(0);

    for (let count = 0; count < 100; count++) component.increaseQuantity();
    expect(component.quantity()).toBe(99);

    component.decreaseQuantity();
    expect(component.quantity()).toBe(98);
    expect(TestBed.inject(ShoppingCart).shoppingCartItens()[0].quantity).toBe(98);
  });

  it('restores the quantity from the cart in a new card instance', () => {
    const item = MOCK_KIOSK_ITEMS[0];
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
    component.increaseQuantity();

    const newFixture = TestBed.createComponent(ItemCardForOrder);
    newFixture.componentRef.setInput('item', item);
    newFixture.detectChanges();

    expect(newFixture.componentInstance.quantity()).toBe(1);
    newFixture.destroy();
  });
});
