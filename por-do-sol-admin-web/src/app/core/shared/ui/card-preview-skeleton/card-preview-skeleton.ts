import { Component } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';

@Component({
  selector: 'app-card-preview-skeleton',
  imports: [Skeleton],
  templateUrl: './card-preview-skeleton.html',
  host: { 'aria-hidden': 'true', class: 'block' },
})
export class CardPreviewSkeleton {
  readonly rows = [0, 1, 2, 3]
}
