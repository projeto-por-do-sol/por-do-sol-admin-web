import { TestBed } from '@angular/core/testing';

import { ShoppingCart } from './shopping-cart';
import { ShoppingCartItem } from '../models/shopping-cart-item';

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

  it('changes and removes only the selected cart line', () => {
    const first = Object.assign(new ShoppingCartItem(), { idKiosk: 'kiosk_01', idItem: 'item_01', quantity: 1 });
    const second = Object.assign(new ShoppingCartItem(), { idKiosk: 'kiosk_01', idItem: 'item_01', quantity: 2, complement: ['Granola'] });
    service.addItemToCart(first);
    service.addItemToCart(second);

    const [firstId, secondId] = service.shoppingCartItens().map(item => item.idCartItem!);
    service.setCartItemQuantity(secondId, 3);
    expect(service.shoppingCartItens().map(item => item.quantity)).toEqual([1, 3]);

    service.removeItemFromCart(firstId);
    expect(service.shoppingCartItens()).toEqual([expect.objectContaining({ idCartItem: secondId, quantity: 3 })]);
  });
});
