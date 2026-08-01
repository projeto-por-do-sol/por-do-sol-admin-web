export class Order {

  id?: string
  kioskName?: string
  kioskId?: string
  clientName?: string
  clientId?: string
  items?: string[]
  value?: number
  time?: string
  status?: string = 'Novo'

}
