import { Component } from '@angular/core';
import { Chips } from "../../shared/ui/chips/chips";

@Component({
  selector: 'app-kiosk-grid',
  imports: [Chips],
  templateUrl: './kiosk-grid.html',
  styleUrl: './kiosk-grid.css',
})
export class KioskGrid {

  onSelectedOption(option: string) {
  console.log(option);
  
}

}
