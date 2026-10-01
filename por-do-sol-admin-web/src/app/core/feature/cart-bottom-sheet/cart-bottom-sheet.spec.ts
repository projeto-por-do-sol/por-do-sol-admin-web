import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MOCK_KIOSK_ITEMS } from '../../mocks/mocks';
import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { ShoppingCart } from '../../services/shopping-cart';
import { ItemCardForOrder } from '../item-card-for-order/item-card-for-order';
import { CartBottomSheet } from './cart-bottom-sheet';

describe('CartBottomSheet', () => {
  let fixture: ComponentFixture<CartBottomSheet>;
  let cart: ShoppingCart;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartBottomSheet, ItemCardForOrder],
      providers: [{ provide: MatBottomSheetRef, useValue: { dismiss: vi.fn() } }],
    }).compileComponents();

    cart = TestBed.inject(ShoppingCart);
    fixture = TestBed.createComponent(CartBottomSheet);
    await fixture.whenStable();
  });

  it('shows item details and updates or removes its cart line', () => {
    const product = MOCK_KIOSK_ITEMS[0];
    const item = Object.assign(new ShoppingCartItem(), {
      idKiosk: product.kioskId,
      idItem: product.id,
      quantity: 2,
      removedIngredient: ['Cebola'],
      complement: ['Queijo extra'],
    });
    cart.addItemToCart(item);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(product.name);
    expect(fixture.nativeElement.textContent).toContain('Cebola');
    expect(fixture.nativeElement.textContent).toContain('Queijo extra');
    expect(fixture.componentInstance.summary().quantity).toBe(2);

    (fixture.nativeElement.querySelector('[aria-label^="Aumentar quantidade"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(cart.shoppingCartItens()[0].quantity).toBe(3);

    (fixture.nativeElement.querySelector('[aria-label^="Diminuir quantidade"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(cart.shoppingCartItens()[0].quantity).toBe(2);

    (fixture.nativeElement.querySelector('[aria-label^="Remover "]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(cart.shoppingCartItens()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Seu carrinho está vazio.');
  });
  it('synchronizes the card and sheet controls, including removal at zero', () => {
    const card = TestBed.createComponent(ItemCardForOrder);
    card.componentRef.setInput('item', MOCK_KIOSK_ITEMS[0]);
    card.detectChanges();
    const click = (element: HTMLElement, label: string) =>
      (element.querySelector('[aria-label^="' + label + '"]') as HTMLButtonElement).click();

    click(card.nativeElement, 'Aumentar quantidade');
    fixture.detectChanges();
    card.detectChanges();
    expect(fixture.componentInstance.summary().quantity).toBe(1);

    click(fixture.nativeElement, 'Aumentar quantidade');
    card.detectChanges();
    fixture.detectChanges();
    expect(card.nativeElement.querySelector('output').textContent.trim()).toBe('2');

    click(card.nativeElement, 'Diminuir quantidade');
    fixture.detectChanges();
    expect(fixture.componentInstance.summary().quantity).toBe(1);

    click(fixture.nativeElement, 'Diminuir quantidade');
    card.detectChanges();
    fixture.detectChanges();
    expect(cart.shoppingCartItens()).toEqual([]);
    expect(card.nativeElement.querySelector('output').textContent.trim()).toBe('0');
    expect(card.nativeElement.querySelector('[aria-label^="Diminuir quantidade"]').disabled).toBe(true);
    card.destroy();
  });

});
