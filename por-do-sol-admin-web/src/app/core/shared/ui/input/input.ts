import { Component, input } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input {

  id = input.required<string>()
  label = input.required<string>()
  type = input<string>('text')
  name = input.required<string>()
  placeholder = input<string>()
  isObrigatory = input<boolean>(true)
  value = input<string>("")

}
