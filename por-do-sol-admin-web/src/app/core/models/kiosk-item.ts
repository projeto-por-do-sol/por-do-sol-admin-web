export interface KioskItemComplement {
  name: string
  value: number
}

export interface KioskItem {
  id: string
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
