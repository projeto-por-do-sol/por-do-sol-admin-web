import { nextOrderStatus, Order, ORDER_STATUSES } from './order';

describe('Order', () => {
  it('should create an instance', () => {
    expect(new Order()).toBeTruthy();
  });

  it('uses only the requested statuses and advances through the delivery flow', () => {
    expect(ORDER_STATUSES).toEqual([
      'Esperando confirmação', 'Aceito', 'Preparando', 'Entregando',
      'Atrasado', 'Finalizado', 'Cancelado',
    ]);
    expect(nextOrderStatus('Aceito')).toBe('Preparando');
    expect(nextOrderStatus('Preparando')).toBe('Entregando');
    expect(nextOrderStatus('Entregando')).toBe('Finalizado');
    expect(nextOrderStatus('Atrasado')).toBeUndefined();
    expect(nextOrderStatus('Finalizado')).toBeUndefined();
    expect(nextOrderStatus('Cancelado')).toBeUndefined();
  });

});
