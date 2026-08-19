import { Component, inject } from '@angular/core';
import { SectionTitle } from '../../shared/ui/section-title/section-title';
import { Table, TableColumn } from '../../shared/ui/table/table';
import { MOCK_EMPLOYEE } from '../../mocks/mocks';
import { Employee } from '../../models/employee';
import { TableOrCard } from "../table-or-card/table-or-card";
import { UserInitials } from '../../utils/user-initials';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { TeamService } from '../../services/team-service';

@Component({
  selector: 'app-team',
  imports: [SectionTitle, TableOrCard, NgClass],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {
  readonly teamService = inject(TeamService)
  

  employeeColumns: TableColumn<Employee>[] = [
    {
      key: 'name',
      header: 'Funcionário',
      type: 'avatar'
    },
    {
      key: 'kioskName',
      header: 'Quiosque'
    },
    {
      key: 'role',
      header: 'Cargo'
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

  constructor(private router: Router) { }

  getNameInitials(name: string) {
    return UserInitials.getNameInitials(name)
  }

  goToEmployeeRegister() {
    this.router.navigate(['employeeRegister'])
  }

}
