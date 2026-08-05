import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-chip-multi-choice',
  imports: [NgClass],
  templateUrl: './chip-multi-choice.html',
  styleUrl: './chip-multi-choice.css',
})
export class ChipMultiChoice {

  options = input.required<string[]>()

  selectedOptions: string[] = []

  outputSelected = output<string[]>()

  ngOnInit() {

  }

  containsOption(option: string) {
    if (this.selectedOptions.includes(option)) {
      return true
    }
    return false
  }

  choosenOption(option: string) {
    if (this.containsOption(option)) {
      this.selectedOptions = this.selectedOptions.filter(o => o !== option);
    } else {
      this.selectedOptions = [...this.selectedOptions, option];
    }
    this.outputSelected.emit(this.selectedOptions)
  }

}
