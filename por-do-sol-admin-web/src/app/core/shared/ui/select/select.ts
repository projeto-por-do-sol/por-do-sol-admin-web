import { Component, input, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-select',
  imports: [MatSelectModule],
  templateUrl: './select.html',
  styleUrl: './select.css',
})
export class Select {
  selectTitle = input.required<string>();
  options = input.required<string[]>();

  valueChange = output<string>();

  onSelectionChange(event: MatSelectChange) {
    this.valueChange.emit(event.value);
  }
}