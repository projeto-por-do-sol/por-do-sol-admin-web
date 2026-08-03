import { Component } from '@angular/core';
import { SectionTitle } from '../../shared/ui/section-title/section-title';
import { Table, TableColumn } from '../../shared/ui/table/table';
import { MOCK_EMPLOYEE } from '../../mocks/mocks';
import { Employee } from '../../models/employee';
import { TableOrCard } from "../table-or-card/table-or-card";
import { UserInitials } from '../../utils/user-initials';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-team',
  imports: [SectionTitle, Table, TableOrCard, NgClass],
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
      key: 'kioskName',
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

  getNameInitials(name: string) {
    return UserInitials.getNameInitials(name)
  }

  aa() {
    console.log('aaa')
  }

}
