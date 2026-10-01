export const MAX_CART_ITEM_QUANTITY = 99

export function normalizeCartQuantity(quantity: number): number {
  return Number.isFinite(quantity)
    ? Math.min(MAX_CART_ITEM_QUANTITY, Math.max(0, Math.trunc(quantity)))
    : 0
}
