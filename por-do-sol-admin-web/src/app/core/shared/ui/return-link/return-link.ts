import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-return-link',
  imports: [RouterLink],
  templateUrl: './return-link.html',
  styleUrl: './return-link.css',
})
export class ReturnLink {

  text = input.required<string>()
  pageToReturn = input<string>('/')

}
