import { Component, computed, inject, output } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/user-service';
import { Router, RouterLink } from "@angular/router";
import { NavigationService } from '../../services/navigation-service';
import { UserInitials } from '../../utils/user-initials';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { KioskService } from '../../services/kiosk-service';
import { PermissionService } from '../../services/permission-service';

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
  readonly permissions = inject(PermissionService);
  selectedKiosk: string = ''
  viewModalRegister: boolean = false
  viewModalOthers: boolean = false
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

  readonly othersMenuPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetX: 8,
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
  readonly userKioskName = computed(() =>
    this.permissions.isOwner() ? null : this.selectionService.selectedKiosk()?.name ?? null)
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

  setViewModalOthers() {
    this.viewModalOthers = !this.viewModalOthers
    this.registerMenuOpenChange.emit(this.viewModalOthers)
  }

  goToHelp() {
    this.router.navigate(['help'])
    this.setViewModalOthers()
  }

  goToEditProfile() {
    this.router.navigate(['editProfile'])
    this.setViewModalOthers()
  }

  goToCoupons() {
    this.router.navigate(['coupons'])
    this.setViewModal()
  }

  logoutFromMenu() {
    this.setViewModalOthers()
    this.logout()
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  logout() {
    this.userService.logout()
    this.router.navigateByUrl('/login')
  }

}
