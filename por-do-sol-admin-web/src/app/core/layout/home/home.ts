import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { KpiCard } from "../../shared/ui/kpi-card/kpi-card";
import { Header } from "../header/header";
import { CardKioskInfo } from "../../feature/card-kiosk-info/card-kiosk-info";
import { SectionTitle } from "../../shared/ui/section-title/section-title";

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, KpiCard, Header, CardKioskInfo, SectionTitle],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {


}
