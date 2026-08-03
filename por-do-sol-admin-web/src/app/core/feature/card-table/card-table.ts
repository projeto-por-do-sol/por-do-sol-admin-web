import { Component, input, TemplateRef } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-card-table',
  imports: [MatPaginatorModule, NgTemplateOutlet],
  templateUrl: './card-table.html',
  styleUrl: './card-table.css',
})
export class CardTable<T> {
  ELEMENT_DATA = input.required<T[]>();
  cardTemplate = input.required<TemplateRef<any>>();

  pageSize = 5;
  pageIndex = 0;

  get items(): T[] {
    const start = this.pageIndex * this.pageSize;
    return this.ELEMENT_DATA().slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
