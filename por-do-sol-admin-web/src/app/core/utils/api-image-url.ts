import { API_BASE_URL } from '../config/api';

export function apiImageUrl(path: string | null | undefined): string | undefined {
  const value = path?.trim();
  if (!value) return undefined;
  return new URL(value, `${API_BASE_URL}/`).href;
}
