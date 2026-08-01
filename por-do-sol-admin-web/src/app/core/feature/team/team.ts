import { Component } from '@angular/core';
import { SectionTitle } from '../../shared/ui/section-title/section-title';
import { Table, TableColumn } from '../../shared/ui/table/table';
import { MOCK_EMPLOYEE } from '../../mocks/mocks';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-team',
  imports: [SectionTitle, Table],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {

  employees = MOCK_EMPLOYEE;

  employeeColumns: TableColumn<Employee>[] = [
    {
      key: 'name',
      header: 'Funcionário',
      type: 'avatar'
    },
    {
      key: 'role',
      header: 'Cargo'
    },
    {
      key: 'kiosk',
      header: 'Quiosque'
    },
    {
      key: 'startShift',
      header: 'Turno',
      formatter: e => `${e.startShift} - ${e.finishShift}`
    },
    {
      key: 'status',
      header: 'Status',
      type: 'statusEmployee'
    }
  ];

  aa() {
    console.log('aaa')
  }

}
