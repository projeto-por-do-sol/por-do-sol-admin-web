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
}
