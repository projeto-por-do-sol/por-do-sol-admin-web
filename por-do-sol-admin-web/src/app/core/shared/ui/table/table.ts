import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Employee } from '../../../models/employee';
import { MOCK_EMPLOYEE } from '../../../mocks/mocks';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table implements AfterViewInit {
  columns: string[] = ['name', 'role', 'kiosk', 'shift', 'status']
  ELEMENT_DATA: Employee[] = MOCK_EMPLOYEE
  dataSource = new MatTableDataSource<Employee>(this.ELEMENT_DATA);

  constructor(private paginatorIntl: MatPaginatorIntl) { }

  ngOnInit() {
    this.paginatorIntl.itemsPerPageLabel = 'Itens por página:';
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}





