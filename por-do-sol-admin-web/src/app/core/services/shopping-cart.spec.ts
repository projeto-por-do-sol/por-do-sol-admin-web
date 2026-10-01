import { TestBed } from '@angular/core/testing';

import { ShoppingCart } from './shopping-cart';

describe('ShoppingCart', () => {
  let service: ShoppingCart;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingCart);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores quantities by kiosk and item and removes zero quantities', () => {
    service.setItemQuantity('kiosk_01', 'item_01', 2);
    service.setItemQuantity('kiosk_02', 'item_01', 3);
    service.setItemQuantity('kiosk_01', 'item_01', 1);

    expect(service.shoppingCartItens()).toEqual([
      expect.objectContaining({ idKiosk: 'kiosk_01', idItem: 'item_01', quantity: 1 }),
      expect.objectContaining({ idKiosk: 'kiosk_02', idItem: 'item_01', quantity: 3 }),
    ]);

    service.setItemQuantity('kiosk_01', 'item_01', 0);
    expect(service.shoppingCartItens()).toEqual([
      expect.objectContaining({ idKiosk: 'kiosk_02', idItem: 'item_01', quantity: 3 }),
    ]);
  });
});
