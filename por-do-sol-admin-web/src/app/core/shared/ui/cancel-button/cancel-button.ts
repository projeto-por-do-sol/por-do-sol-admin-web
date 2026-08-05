import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-cancel-button',
  imports: [],
  templateUrl: './cancel-button.html',
  styleUrl: './cancel-button.css',
})
export class CancelButton {

  labelButton = input<string>('Cancelar')
  onClickButton = output<MouseEvent>()

}
