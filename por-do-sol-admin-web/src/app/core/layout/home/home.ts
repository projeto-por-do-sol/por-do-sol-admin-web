import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { KpiCard } from "../../shared/ui/kpi-card/kpi-card";

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, KpiCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  hasNotification: boolean = false

  horario: number = new Date().getHours()
  cumprimento: string = "Bom dia"

  ngOnInit(){
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
