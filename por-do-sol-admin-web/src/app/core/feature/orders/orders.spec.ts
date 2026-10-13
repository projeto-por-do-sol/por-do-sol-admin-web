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
