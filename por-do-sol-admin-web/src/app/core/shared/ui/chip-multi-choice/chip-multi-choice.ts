import { NgClass } from '@angular/common';
import { Component, input, output, signal, effect } from '@angular/core';

@Component({
  selector: 'app-chip-multi-choice',
  imports: [NgClass],
  templateUrl: './chip-multi-choice.html',
  styleUrl: './chip-multi-choice.css',
})
export class ChipMultiChoice {

  options = input.required<string[]>()
  initialSelection = input<string[]>([])

  selectedOptions = signal<string[]>([])

  outputSelected = output<string[]>()

  constructor() {
    effect(() => this.selectedOptions.set([...this.initialSelection()]))
  }

  containsOption(option: string) {
    if (this.selectedOptions().includes(option)) {
      return true
    }
    return false
  }

  choosenOption(option: string) {
    if (this.containsOption(option)) {
      this.selectedOptions.update(options => options.filter(o => o !== option));
    } else {
      this.selectedOptions.update(options => [...options, option]);
    }
    this.outputSelected.emit(this.selectedOptions())
  }

}
