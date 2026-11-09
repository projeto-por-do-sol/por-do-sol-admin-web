import { Component, input, output, signal, TemplateRef } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TableColumn, Table } from '../../shared/ui/table/table';
import { CardTable } from '../card-table/card-table';
import { ListSkeleton } from '../../shared/ui/list-skeleton/list-skeleton';

@Component({
  selector: 'app-table-or-card',
  imports: [Table, CardTable, ListSkeleton],
  templateUrl: './table-or-card.html',
  styleUrl: './table-or-card.css',
})
export class TableOrCard {

  columns = input.required<TableColumn[]>()
  ELEMENT_DATA = input.required<unknown[]>();
  cardTemplate = input.required<TemplateRef<any>>()
  cellTemplate = input<TemplateRef<any>>()
  clickableRows = input(false)
  rowClick = output<any>()
  /** Mensagem exibida no lugar da tabela/cards quando não há registros. */
  emptyMessage = input('')
  /** Exibe o skeleton enquanto não há registros. Com registros na tela, uma atualização não esconde a lista. */
  loading = input(false)
  loadingLabel = input('Carregando...')

  isMobile = signal(false)

  constructor(private breakpoint: BreakpointObserver) {
    breakpoint.observe('(max-width: 1050px)').subscribe(result => {
      this.isMobile.set(result.matches)
    })
  }

}
