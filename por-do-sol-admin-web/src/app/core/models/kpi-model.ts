export class KpiModel {

  lable?: string
  value?: String
  variation?: string
  direction?: boolean

  constructor(lable: string, value: string, variation: string, direction: boolean) {
    this.lable = lable
    this.value = value
    this.variation = variation
    this.direction = direction
  }

}
