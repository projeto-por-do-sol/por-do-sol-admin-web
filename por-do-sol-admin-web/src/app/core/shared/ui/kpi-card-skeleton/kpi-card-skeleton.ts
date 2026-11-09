import { Component } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';

@Component({
  selector: 'app-kpi-card-skeleton',
  imports: [Skeleton],
  templateUrl: './kpi-card-skeleton.html',
  host: { 'aria-hidden': 'true' },
})
export class KpiCardSkeleton {
  readonly cards = [0, 1, 2, 3]
}
