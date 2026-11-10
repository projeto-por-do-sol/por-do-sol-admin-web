import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';

export type FormSkeletonRow = 'image' | 'field' | 'pair' | 'textarea' | 'map' | 'chips' | 'chipsField' | 'text' | 'fieldAction' | 'pairAction'

@Component({
  selector: 'app-form-skeleton',
  imports: [NgTemplateOutlet, Skeleton],
  templateUrl: './form-skeleton.html',
  host: { 'aria-hidden': 'true', class: 'block' },
})
export class FormSkeleton {
  sections = input.required<FormSkeletonRow[][]>()

  readonly chips = [0, 1, 2, 3, 4, 5, 6]
}
