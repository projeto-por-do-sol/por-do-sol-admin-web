import { AfterViewInit, Component, ViewChild, computed, input } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Employee } from '../../../models/employee';
import { MOCK_EMPLOYEE } from '../../../mocks/mocks';
import { NgClass } from '@angular/common';

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

  constructor(private paginatorIntl: MatPaginatorIntl) { }

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
    const firtInitial = name.charAt(0) || "!"
    let secondInitial = ""

    // Se o usuário ter 2 nomes cadastrados ele pega as duas iniciais
    if (name.split(" ").length >= 2) {

      // Filtra o nome do usuário para remover nomes como: "da/de". Exemplo: José da Silva, transforma em: José Silva. Iniciais: JS
      const splitName = name.split(" ").filter(x => x.length > 2)
      secondInitial = splitName[1].charAt(0)
    }
    return `${firtInitial}${secondInitial}`
  }

  orderStatus(status: string): string {
    status = status.toLowerCase()
    if (status != 'em preparo') {
      return status
    }
    return 'em_preparo'
  }

}

export interface TableColumn<T = any> {
  key: keyof T & string
  header: string
  type?: 'avatar' | 'statusEmployee' | 'statusOrder' | 'list'
  formatter?: (item: T) => string
}

