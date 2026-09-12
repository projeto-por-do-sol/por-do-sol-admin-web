import { Component, inject, Signal } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../models/user-model';
import { UserService } from '../../services/user-service';
import { Router, RouterLink } from "@angular/router";
import { NavigationService } from '../../services/navigation-service';
import { UserInitials } from '../../utils/user-initials';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { KioskService } from '../../services/kiosk-service';

@Component({
  selector: 'app-sidebar',
  imports: [MatSelectModule, RouterLink, OverlayModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly kioskService = inject(KioskService);
  readonly selectionService = inject(KioskSelectionService);
  selectedKiosk: string = ''
  viewModalRegister: boolean = false

  readonly registerMenuPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 8,
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -8,
    },
  ]

  user!: Signal<User | null>
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

  onSelectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectionService.selectKiosk(value === 'all' ? null : value);
  }

  // Pega as iniciais do usuário logado para colocar na sidebar
  getNameInitials() {
    const user = this.user()
    this.userNameInitials = user?.name ? UserInitials.getNameInitials(user.name) : ''
  }

  setViewModal() {
    this.viewModalRegister = !this.viewModalRegister
  }

  goToKioskRegister() {
    this.router.navigate(['kioskRegister'])
    this.setViewModal()
  }

  goToEmployeeRegister() {
    this.router.navigate(['employeeRegister'])
    this.setViewModal()
  }

  logout() {
    this.userService.logout()
    this.router.navigateByUrl('/login')
  }

}
