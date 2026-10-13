import { StatusStyle } from './status-style';

describe('StatusStyle', () => {
  it('maps every order status to its CSS class', () => {
    expect(StatusStyle.orderStatus('CRIADO')).toBe('criado');
    expect(StatusStyle.orderStatus('ACEITO')).toBe('aceito');
    expect(StatusStyle.orderStatus('PREPARANDO')).toBe('preparando');
    expect(StatusStyle.orderStatus('EM_ENTREGA')).toBe('em_entrega');
    expect(StatusStyle.orderStatus('FINALIZADO')).toBe('finalizado');
    expect(StatusStyle.orderStatus('AVALIADO')).toBe('avaliado');
    expect(StatusStyle.orderStatus('CANCELADO')).toBe('cancelado');
    expect(StatusStyle.orderStatus('REJEITADO')).toBe('rejeitado');
  });
});
