import { Component, input } from '@angular/core';
import { UserInitials } from '../../../utils/user-initials';

export interface PreviewItem {
  label: string;
  value: string;
  type?: 'status' | 'info';
}


@Component({
  selector: 'app-card-preview',
  imports: [],
  templateUrl: './card-preview.html',
  styleUrl: './card-preview.css',
})
export class CardPreview {

  contextLabel = input<string>('cadastro')
  name = input.required<string>()
  role = input<string>()
  items = input<PreviewItem[]>([])
  lastText = input<string>('')

  getNameInitials(name: string) {
    return UserInitials.getNameInitials(name.toUpperCase())
  }
}
