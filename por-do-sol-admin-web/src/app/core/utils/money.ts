export function parseBrl(value: string | null | undefined): number | null {
  const normalized = (value ?? '').trim().replace(/\./g, '').replace(',', '.')
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}
