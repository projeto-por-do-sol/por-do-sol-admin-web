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
    expect(nextOrderStatus('PREPARANDO')).toBeUndefined();
    expect(nextOrderStatus('EM_ENTREGA')).toBeUndefined();
    expect(nextOrderStatus('FINALIZADO')).toBeUndefined();
    expect(nextOrderStatus('CANCELADO')).toBeUndefined();
    expect(nextOrderStatus('REJEITADO')).toBeUndefined();
  });

  it('only lets the panel finish orders made at the kiosk counter', () => {
    expect(nextOrderStatus('ACEITO', true)).toBe('PREPARANDO');
    expect(nextOrderStatus('PREPARANDO', true)).toBe('FINALIZADO');
    expect(nextOrderStatus('EM_ENTREGA', true)).toBe('FINALIZADO');
    expect(nextOrderStatus('FINALIZADO', true)).toBeUndefined();
  });

  it('shows a label for each status', () => {
    expect(orderStatusLabel('CRIADO')).toBe('Esperando confirmação');
    expect(orderStatusLabel('EM_ENTREGA')).toBe('Entregando');
    expect(orderStatusLabel('REJEITADO')).toBe('Recusado');
  });

});
