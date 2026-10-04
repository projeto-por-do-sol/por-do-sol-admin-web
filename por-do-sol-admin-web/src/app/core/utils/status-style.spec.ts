import { StatusStyle } from './status-style';

describe('StatusStyle', () => {
  it('maps every order status to its CSS class', () => {
    expect(StatusStyle.orderStatus('Esperando confirmação')).toBe('esperando_confirmacao');
    expect(StatusStyle.orderStatus('Aceito')).toBe('aceito');
    expect(StatusStyle.orderStatus('Preparando')).toBe('preparando');
    expect(StatusStyle.orderStatus('Entregando')).toBe('entregando');
    expect(StatusStyle.orderStatus('Atrasado')).toBe('atrasado');
    expect(StatusStyle.orderStatus('Finalizado')).toBe('finalizado');
    expect(StatusStyle.orderStatus('Cancelado')).toBe('cancelado');
  });
});
