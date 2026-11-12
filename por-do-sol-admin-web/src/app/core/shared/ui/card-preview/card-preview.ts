import { Component, input } from '@angular/core';
import { UserInitials } from '../../../utils/user-initials';
import { ApiImagePipe } from '../../pipes/api-image-pipe';
import { AsyncPipe } from '@angular/common';

export interface PreviewItem {
  label: string;
  value: string;
  type?: 'status' | 'info';
}


@Component({
  selector: 'app-card-preview',
  imports: [ApiImagePipe, AsyncPipe],
  templateUrl: './card-preview.html',
  styleUrl: './card-preview.css',
})
export class CardPreview {

  contextLabel = input<string>('cadastro')
  name = input.required<string>()
  role = input<string>()
  items = input<PreviewItem[]>([])
  lastText = input<string>('')
  imageUrl = input<string | null>(null)
  showItemPlaceholder = input<boolean>(false)

  getNameInitials(name: string) {
    return UserInitials.getNameInitials(name.toUpperCase())
  }
}
