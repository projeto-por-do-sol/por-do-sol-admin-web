export class ShoppingCartItem {

  idCartItem: number | null = null
  idKiosk: string | null = null
  idItem: string | null = null
  quantity: number = 0
  removedIngredient?: string[]
  complement?: string[]

}
