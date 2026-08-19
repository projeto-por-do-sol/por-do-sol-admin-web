import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  labelButton = input.required<string>()
  type = input<string>('button')
  prefix = input<boolean>()
  icon = input<string>()
  onClickButton = output<MouseEvent>()
  fullWidth = input<boolean>(false);

  iconPath: string = ''

  ngOnInit() {
    this.iconPath = '/assets/icons/' + this.icon() + ".svg"
  }

}
