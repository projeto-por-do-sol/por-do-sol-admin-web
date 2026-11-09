import { Component } from '@angular/core';
import { Skeleton } from '../../shared/ui/skeleton/skeleton';

@Component({
  selector: 'app-statistics-skeleton',
  imports: [Skeleton],
  templateUrl: './statistics-skeleton.html',
  host: { 'aria-hidden': 'true' },
})
export class StatisticsSkeleton {

  readonly charts = [
    { wide: true, height: 329 },
    { wide: false, height: 264 },
    { wide: true, height: 329 },
    { wide: false, height: 314 },
  ]
}
