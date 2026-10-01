import { KioskItem } from '../models/kiosk-item';
import { ShoppingCartItem } from '../models/shopping-cart-item';

export function cartItemUnitPrice(cartItem: ShoppingCartItem, product: KioskItem | undefined): number {
  if (!product) return 0

  const complements = cartItem.complement ?? []
  return product.value + complements.reduce((total, name) =>
    total + (product.complements?.find(complement => complement.name === name)?.value ?? 0), 0)
}
