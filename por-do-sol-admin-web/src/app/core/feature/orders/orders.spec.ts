import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Orders } from './orders';
import { OrderService } from '../../services/order-service';

describe('Orders', () => {
  let component: Orders;
  let fixture: ComponentFixture<Orders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orders],
      providers: [provideRouter([]), { provide: OrderService, useValue: { orders: signal([]), failedKiosks: signal([]), lastUpdated: signal(null), loadOrders: () => Promise.resolve(), loadOrdersByStatus: () => Promise.resolve(), isSaving: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(Orders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Orders enquanto carrega', () => {
  let fixture: ComponentFixture<Orders>;
  let finishActive: () => void;
  let finishByStatus: () => void;
  const element = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    const pending = (onResolve: (resolve: () => void) => void) => new Promise<void>(resolve => onResolve(resolve));
    await TestBed.configureTestingModule({
      imports: [Orders],
      providers: [provideRouter([]), {
        provide: OrderService,
        useValue: {
          orders: signal([]), failedKiosks: signal([]), lastUpdated: signal(null), isSaving: () => false,
          loadOrders: () => pending(resolve => finishActive = resolve),
          loadOrdersByStatus: () => pending(resolve => finishByStatus = resolve),
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(Orders);
    fixture.detectChanges();
  });

  async function settle() {
    await new Promise(resolve => setTimeout(resolve));
    fixture.detectChanges();
  }

  it('mostra o skeleton em vez de "Nenhum pedido!" até a resposta chegar', async () => {
    expect(element().querySelector('app-list-skeleton')).toBeTruthy();
    expect(element().textContent).not.toContain('Nenhum pedido!');

    finishActive();
    await settle();

    expect(element().querySelector('app-list-skeleton')).toBeNull();
    expect(element().textContent).toContain('Nenhum pedido!');
  });

  it('continua carregando até terminarem os ativos e o filtro de finalizados', async () => {
    fixture.componentInstance.onSelectedOption('Finalizado');
    fixture.detectChanges();

    finishActive();
    await settle();
    expect(element().querySelector('app-list-skeleton')).toBeTruthy();
    expect(element().textContent).not.toContain('Nenhum pedido!');

    finishByStatus();
    await settle();
    expect(element().querySelector('app-list-skeleton')).toBeNull();
    expect(element().textContent).toContain('Nenhum pedido!');
  });
});
