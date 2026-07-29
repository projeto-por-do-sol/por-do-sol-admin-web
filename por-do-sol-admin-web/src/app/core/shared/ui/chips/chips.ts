import { NgClass } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';


@Component({
  selector: 'app-chips',
  imports: [NgClass],
  templateUrl: './chips.html',
  styleUrl: './chips.css',
})
export class Chips {
  options = input.required<string[]>()
  standardOption = input.required<string>()
  selectedOption = signal("")
  outputSelected = output<string>()

  ngOnInit() {
    this.selectedOption.set(this.standardOption())
  }

  choosenOption(option: string) {
    this.selectedOption.set(option)
    this.outputSelected.emit(option)
  }
}


