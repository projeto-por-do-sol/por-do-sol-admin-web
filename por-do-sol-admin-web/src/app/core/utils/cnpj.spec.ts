import { describe, expect, it } from 'vitest';
import { formatCnpj, isValidCnpj, unmaskCnpj } from './cnpj';

describe('CNPJ helpers', () => {
  it('formats numeric and alphanumeric values', () => {
    expect(formatCnpj('11222333000181')).toBe('11.222.333/0001-81');
    expect(formatCnpj('ab12cd34ef5601')).toBe('AB.12C.D34/EF56-01');
  });

  it('removes punctuation and unsupported characters', () => {
    expect(unmaskCnpj('ab.12c/34!ef56-01')).toBe('AB12C34EF5601');
  });

  it('validates check digits', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
    expect(isValidCnpj('12.ABC.345/01DE-35')).toBe(true);
    expect(isValidCnpj('11.222.333/0001-82')).toBe(false);
    expect(isValidCnpj('00.000.000/0000-00')).toBe(false);
  });
});
