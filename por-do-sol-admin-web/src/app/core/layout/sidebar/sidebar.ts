import { Component, Signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../models/user-model';
import { UserService } from '../../services/user-service';
import { Router, RouterLink } from "@angular/router";
import { NavigationService } from '../../services/navigation-service';
import { UserInitials } from '../../utils/user-initials';

@Component({
  selector: 'app-sidebar',
  imports: [MatSelectModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  selectedKiosk: string = ''
  viewModalRegister: boolean = false

  user!: Signal<User>
  userNameInitials: string = ""

  constructor(
    private userService: UserService,
    public navigation: NavigationService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.user = this.userService.user;
    this.getNameInitials()
  }

  // Pega as iniciais do usuário logado para colocar na sidebar
  getNameInitials() {
    this.userNameInitials = UserInitials.getNameInitials(this.user().name!)
  }

  setViewModal(){
    this.viewModalRegister = !this.viewModalRegister
  }

  goToKioskRegister(){
    this.router.navigate(['kioskRegister'])
  }

  goToEmployeeRegister(){
    this.router.navigate(['employeeRegister'])
  }

}
