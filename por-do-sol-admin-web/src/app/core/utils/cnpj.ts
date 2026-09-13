import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const CNPJ_BASE_LENGTH = 12;
const CNPJ_LENGTH = 14;

export function unmaskCnpj(value: string): string {
  return value.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, CNPJ_LENGTH);
}

export function formatCnpj(value: string): string {
  const cnpj = unmaskCnpj(value);
  const parts = [
    cnpj.slice(0, 2),
    cnpj.slice(2, 5),
    cnpj.slice(5, 8),
    cnpj.slice(8, 12),
    cnpj.slice(12, 14),
  ];

  let formatted = parts[0];
  if (parts[1]) formatted += `.${parts[1]}`;
  if (parts[2]) formatted += `.${parts[2]}`;
  if (parts[3]) formatted += `/${parts[3]}`;
  if (parts[4]) formatted += `-${parts[4]}`;
  return formatted;
}

function calculateDigit(value: string): number {
  let weight = value.length - 7;
  const sum = [...value].reduce((total, character) => {
    const characterValue = character.charCodeAt(0) - 48;
    const result = total + characterValue * weight;
    weight = weight === 2 ? 9 : weight - 1;
    return result;
  }, 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(value: string): boolean {
  const cnpj = unmaskCnpj(value);
  if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpj)) return false;
  if (/^(.)\1{13}$/.test(cnpj)) return false;

  const base = cnpj.slice(0, CNPJ_BASE_LENGTH);
  const firstDigit = calculateDigit(base);
  const secondDigit = calculateDigit(`${base}${firstDigit}`);
  return cnpj === `${base}${firstDigit}${secondDigit}`;
}

export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return isValidCnpj(String(control.value)) ? null : { cnpj: true };
  };
}
