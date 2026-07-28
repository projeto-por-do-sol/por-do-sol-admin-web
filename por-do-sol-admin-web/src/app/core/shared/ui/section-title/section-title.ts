import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  imports: [],
  templateUrl: './section-title.html',
  styleUrl: './section-title.css',
})
export class SectionTitle {

  lable = input.required<string>()
  section = input.required<string>()
  text = input.required<string>()

}
