import { nextOrderStatus, Order, ORDER_STATUSES, orderStatusLabel } from './order';

describe('Order', () => {
  it('should create an instance', () => {
    expect(new Order()).toBeTruthy();
  });

  it('uses the API statuses and advances through the delivery flow', () => {
    expect(ORDER_STATUSES).toEqual([
      'CRIADO', 'ACEITO', 'PREPARANDO', 'EM_ENTREGA',
      'FINALIZADO', 'AVALIADO', 'CANCELADO', 'REJEITADO',
    ]);
    expect(nextOrderStatus('ACEITO')).toBe('PREPARANDO');
    expect(nextOrderStatus('PREPARANDO')).toBe('EM_ENTREGA');
    expect(nextOrderStatus('EM_ENTREGA')).toBe('FINALIZADO');
    expect(nextOrderStatus('FINALIZADO')).toBeUndefined();
    expect(nextOrderStatus('CANCELADO')).toBeUndefined();
    expect(nextOrderStatus('REJEITADO')).toBeUndefined();
  });

  it('shows a label for each status', () => {
    expect(orderStatusLabel('CRIADO')).toBe('Esperando confirmação');
    expect(orderStatusLabel('EM_ENTREGA')).toBe('Entregando');
    expect(orderStatusLabel('REJEITADO')).toBe('Recusado');
  });

});
