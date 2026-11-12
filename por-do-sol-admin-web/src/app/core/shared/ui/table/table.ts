import { AfterViewInit, Component, TemplateRef, ViewChild, computed, input, output } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { UserInitials } from '../../../utils/user-initials';
import { StatusStyle } from '../../../utils/status-style';
import { OrderStatus, orderStatusLabel } from '../../../models/order';
import { ApiImagePipe } from '../../pipes/api-image-pipe';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatPaginatorModule, NgClass, NgTemplateOutlet, ApiImagePipe, AsyncPipe],
  templateUrl: './table.html',
  styleUrl: './table.css',
})

export class Table implements AfterViewInit {
  columns = input.required<TableColumn[]>()
  ELEMENT_DATA = input.required<unknown[]>()
  cellTemplate = input<TemplateRef<any>>()
  clickableRows = input(false)
  rowClick = output<any>()
  dataSource = new MatTableDataSource()

  displayedColumns = computed(() =>
    this.columns().map(column => column.key)
  );

  constructor(
    private paginatorIntl: MatPaginatorIntl
  ) {

  }

  ngOnChanges() {
    this.dataSource.data = this.ELEMENT_DATA()
  }

  ngOnInit() {
    this.paginatorIntl.itemsPerPageLabel = 'Itens por página:';
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Pega as iniciais do usuário logado para colocar na sidebar
  getNameInitials(name: string): string {
    return UserInitials.getNameInitials(name)
  }

  orderStatus(status: OrderStatus): string {
    return StatusStyle.orderStatus(status)
  }

  orderStatusLabel(status: OrderStatus): string {
    return orderStatusLabel(status)
  }

  // Enter só abre a linha quando o foco está nela, não em um botão dentro dela.
  onRowKeydown(event: Event, row: unknown): void {
    if (this.clickableRows() && event.target === event.currentTarget) {
      this.rowClick.emit(row)
    }
  }

  isSubItem(item: unknown): boolean {
    return typeof item === 'string' && (item.startsWith('- ') || item.startsWith('+ '))
  }

}

export interface TableColumn<T = any> {
  key: keyof T & string | 'actions'
  header: string
  type?: 'avatar' | 'statusEmployee' | 'statusOrder' | 'list' | 'image' | 'template'
  formatter?: (item: T) => string
}
