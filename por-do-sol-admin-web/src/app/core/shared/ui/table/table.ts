import { AfterViewInit, Component, ViewChild, computed, input } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Employee } from '../../../models/employee';
import { MOCK_EMPLOYEE } from '../../../mocks/mocks';
import { NgClass } from '@angular/common';
import { UserInitial } from '../../../utils/user-initials';
import { StatusStyle } from '../../../utils/status-style';


@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatPaginatorModule, NgClass],
  templateUrl: './table.html',
  styleUrl: './table.css',
})

export class Table implements AfterViewInit {
  columns = input.required<TableColumn[]>()
  ELEMENT_DATA = input.required<unknown[]>();
  dataSource = new MatTableDataSource();

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
    return UserInitial.getNameInitials(name)
  }

  orderStatus(status: string): string {
    return StatusStyle.orderStatus(status)
  }

}

export interface TableColumn<T = any> {
  key: keyof T & string
  header: string
  type?: 'avatar' | 'statusEmployee' | 'statusOrder' | 'list'
  formatter?: (item: T) => string
}

