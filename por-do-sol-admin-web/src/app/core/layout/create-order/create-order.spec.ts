import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CreateOrder } from './create-order';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { ShoppingCart } from '../../services/shopping-cart';
import { MOCK_KIOSK_ITEMS } from '../../mocks/mocks';

describe('CreateOrder', () => {
  let component: CreateOrder;
  let fixture: ComponentFixture<CreateOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrder],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters items without changing the sidebar kiosk', () => {
    const sidebarSelection = TestBed.inject(KioskSelectionService);
    sidebarSelection.selectKiosk('kiosk_02');

    component.selectKioskByName('Quiosque teste');

    expect(component.selectedKioskId()).toBe('kiosk_01');
    expect(component.selectedItems().length).toBeGreaterThan(0);
    expect(component.selectedItems().every(item => item.kioskId === 'kiosk_01')).toBe(true);
    expect(sidebarSelection.selectedKioskId()).toBe('kiosk_02');
  });

  it('groups the selected kiosk items by category in alphabetical order', () => {
    component.selectKioskByName('Quiosque teste');

    const groups = component.itemsByCategory();
    expect(groups.map(group => group.category)).toEqual(['Cerveja trincando', 'Frutos do mar', 'Porções']);
    expect(groups.flatMap(group => group.items)).toHaveLength(component.selectedItems().length);
    expect(groups.every(group => group.items.every(item => item.category === group.category))).toBe(true);
  });

  it('searches item names within the selected kiosk', () => {
    component.selectKioskByName('Santos Quiosque');
    component.searchControl.setValue('acai');

    expect(component.filteredItems().length).toBeGreaterThan(0);
    expect(component.filteredItems().every(item => item.name.includes('Açaí'))).toBe(true);
    expect(component.itemsByCategory().map(group => group.category)).toEqual(['Açaí']);

    component.searchControl.setValue('item inexistente');
    expect(component.itemsByCategory()).toEqual([]);
  });

  it('shows the cart summary with unit count and total, then hides it when empty', () => {
    const cart = TestBed.inject(ShoppingCart);
    const [first, second] = MOCK_KIOSK_ITEMS;

    expect(fixture.nativeElement.querySelector('.cart-summary')).toBeNull();

    cart.setItemQuantity(first.kioskId, first.id, 2);
    cart.setItemQuantity(second.kioskId, second.id, 1);
    fixture.detectChanges();

    const summary = fixture.nativeElement.querySelector('.cart-summary') as HTMLElement;
    expect(component.cartSummary().quantity).toBe(3);
    expect(component.cartSummary().total).toBe(first.value * 2 + second.value);
    expect(summary.textContent).toContain('3');
    expect(summary.textContent).toContain(component.formatTotal(component.cartSummary().total));
    expect(summary.textContent).toContain('Próximo');

    cart.setItemQuantity(first.kioskId, first.id, 0);
    cart.setItemQuantity(second.kioskId, second.id, 0);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cart-summary')).toBeNull();
  });
});
