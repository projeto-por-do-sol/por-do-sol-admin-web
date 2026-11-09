import { Component, input } from '@angular/core';

const RADIUS = { line: 'rounded-md', round: 'rounded-full', block: 'rounded-2xl' }

@Component({
  selector: 'app-skeleton',
  template: '',
  host: {
    'aria-hidden': 'true',
    class: 'block animate-pulse bg-skeleton motion-reduce:animate-none',
    '[class]': 'radius[shape()]',
  },
})
export class Skeleton {
  shape = input<keyof typeof RADIUS>('line')
  protected readonly radius = RADIUS
}
