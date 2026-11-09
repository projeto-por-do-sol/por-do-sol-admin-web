import { Component, input } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';
import { TableColumn } from '../table/table';

/** Reproduz o formato da tabela (desktop) ou dos cards (mobile) enquanto a lista carrega. */
@Component({
  selector: 'app-list-skeleton',
  imports: [Skeleton],
  templateUrl: './list-skeleton.html',
  host: { 'aria-hidden': 'true' },
})
export class ListSkeleton {
  columns = input.required<TableColumn[]>()
  asCards = input(false)

  readonly rows = [0, 1, 2, 3, 4]
}
