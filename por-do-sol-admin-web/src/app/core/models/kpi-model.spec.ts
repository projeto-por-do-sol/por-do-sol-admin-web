import { KpiModel } from './kpi-model';

describe('KpiModel', () => {
  it('should create an instance', () => {
    expect(new KpiModel('Pedidos', '10', '5%', true)).toBeTruthy();
  });
});
