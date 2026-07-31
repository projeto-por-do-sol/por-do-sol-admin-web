import { Component, input, output } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-section-title',
  imports: [Button],
  templateUrl: './section-title.html',
  styleUrl: './section-title.css',
})
export class SectionTitle {

  lable = input.required<string>()
  section = input.required<string>()
  text = input.required<string>()
  labelButton = input<string>("")
  onClickButton = output<MouseEvent>()
  prefix = input<boolean>()
  icon = input<string>()
}
