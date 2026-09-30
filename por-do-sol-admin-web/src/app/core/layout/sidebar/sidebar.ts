import { Component, computed, inject, output } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';
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
  private readonly userService = inject(UserService);
  readonly kioskService = inject(KioskService);
  readonly selectionService = inject(KioskSelectionService);
  selectedKiosk: string = ''
  viewModalRegister: boolean = false
  readonly registerMenuOpenChange = output<boolean>()

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

  readonly user = this.userService.user
  readonly userNameInitials = computed(() => {
    const name = this.user()?.name
    return name ? UserInitials.getNameInitials(name) : ''
  })

  constructor(
    public navigation: NavigationService,
    private router: Router,

  ) { }

  onSelectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectionService.selectKiosk(value === 'all' ? null : value);
  }

  setViewModal() {
    this.viewModalRegister = !this.viewModalRegister
    this.registerMenuOpenChange.emit(this.viewModalRegister)
  }

  goToKioskRegister() {
    this.router.navigate(['kioskRegister'])
    this.setViewModal()
  }

  goToEmployeeRegister() {
    this.router.navigate(['employeeRegister'])
    this.setViewModal()
  }

  goToItemRegister() {
    this.router.navigate(['itemRegister'])
    this.setViewModal()
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  logout() {
    this.userService.logout()
    this.router.navigateByUrl('/login')
  }

}
