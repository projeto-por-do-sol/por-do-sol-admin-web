import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { PermissionService } from '../../services/permission-service';
import { NewOrderAlertService } from '../../services/new-order-alert-service';
import { NewOrdersDialog } from '../../feature/new-orders-dialog/new-orders-dialog';

@Component({
  selector: 'app-header',
  imports: [NewOrdersDialog],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  readonly selectionService = inject(KioskSelectionService)
  readonly permissions = inject(PermissionService)

  readonly alerts = inject(NewOrderAlertService)
  private readonly router = inject(Router)

  readonly dialogOpen = signal(false)

  horario: number = new Date().getHours()
  cumprimento: string = "Bom dia"

  ngOnInit() {
    this.setCumprimento()
  }

  openNotifications() {
    this.alerts.markSeen(this.alerts.alertOrders())
    this.dialogOpen.set(true)
  }

  goToOrder() {
    this.dialogOpen.set(false)
    void this.router.navigate(['/home'], { fragment: 'pedidos' })
    setTimeout(() => document.getElementById('pedidos')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  setCumprimento() {
    if (0 <= this.horario && this.horario < 6) {
      this.cumprimento = "Boa madrugada"
    } else if (6 < this.horario && this.horario < 12) {
      this.cumprimento = "Bom dia"
    } else if (12 < this.horario && this.horario < 18) {
      this.cumprimento = "Boa tarde"
    } else if (18 < this.horario && this.horario <= 23) {
      this.cumprimento = "Boa noite"
    }
  }

}
