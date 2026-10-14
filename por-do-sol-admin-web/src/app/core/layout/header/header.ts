import { Component, inject } from '@angular/core';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { PermissionService } from '../../services/permission-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  readonly selectionService = inject(KioskSelectionService)
  readonly permissions = inject(PermissionService)

  hasNotification: boolean = false

  horario: number = new Date().getHours()
  cumprimento: string = "Bom dia"

  ngOnInit() {
    this.setCumprimento()
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
