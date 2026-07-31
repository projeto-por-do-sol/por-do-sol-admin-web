import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  labelButton = input.required<string>()
  prefix = input<boolean>()
  icon = input<string>()
  onClickButton = output<MouseEvent>()

  iconPath: string = ''

  ngOnInit() {
    this.iconPath = '/assets/icons/' + this.icon() + ".svg"
  }

}
