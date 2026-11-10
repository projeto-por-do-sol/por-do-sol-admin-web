import { Component } from '@angular/core';
import { Skeleton } from '../../shared/ui/skeleton/skeleton';

@Component({
  selector: 'app-coupon-list-skeleton',
  imports: [Skeleton],
  templateUrl: './coupon-list-skeleton.html',
  host: { 'aria-hidden': 'true', class: 'block' },
})
export class CouponListSkeleton {
  readonly rows = [0, 1, 2]
}
