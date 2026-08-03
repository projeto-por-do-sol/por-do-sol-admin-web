import { Component, input, signal, TemplateRef } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TableColumn, Table } from '../../shared/ui/table/table';
import { CardTable } from '../card-table/card-table';

@Component({
  selector: 'app-table-or-card',
  imports: [Table, CardTable],
  templateUrl: './table-or-card.html',
  styleUrl: './table-or-card.css',
})
export class TableOrCard {

  columns = input.required<TableColumn[]>()
  ELEMENT_DATA = input.required<unknown[]>();
  cardTemplate = input.required<TemplateRef<any>>();

  isMobile = signal(false)

  constructor(private breakpoint: BreakpointObserver) {
    breakpoint.observe('(max-width: 1050px').subscribe(result => {
      this.isMobile.set(result.matches)
    })
  }

}
