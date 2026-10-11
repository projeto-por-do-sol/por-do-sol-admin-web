export interface KioskItemComplement {
  id?: number
  name: string
  value: number
}

export interface KioskItem {
  id: string
  categoryId?: number
  baseValue?: number
  promotionalValue?: number | null
  order?: number | null
  kioskId: string
  kioskName: string
  name: string
  category: string
  description: string
  imageUrl: string
  value: number
  ingredients?: string[]
  complements?: KioskItemComplement[]
}
