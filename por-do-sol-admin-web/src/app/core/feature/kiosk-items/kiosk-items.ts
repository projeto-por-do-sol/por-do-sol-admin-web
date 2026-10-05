import { Component, inject } from '@angular/core';
import { KioskItem } from '../../models/kiosk-item';
import { KioskItemService } from '../../services/kiosk-item-service';
import { SectionTitle } from '../../shared/ui/section-title/section-title';
import { TableColumn } from '../../shared/ui/table/table';
import { TableOrCard } from '../table-or-card/table-or-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kiosk-items',
  imports: [SectionTitle, TableOrCard],
  templateUrl: './kiosk-items.html',
  styleUrl: './kiosk-items.css',
})
export class KioskItems {
  readonly kioskItemService = inject(KioskItemService)
  private readonly router = inject(Router)

  readonly itemColumns: TableColumn<KioskItem>[] = [
    { key: 'imageUrl', header: 'Imagem', type: 'image' },
    { key: 'name', header: 'Item' },
    { key: 'category', header: 'Categoria' },
    { key: 'kioskName', header: 'Quiosque' },
    { key: 'description', header: 'Descrição', formatter: item => this.shortDescription(item.description) },
    { key: 'value', header: 'Valor', formatter: item => this.formatValue(item.value) },
    { key: 'actions', header: 'Editar', type: 'template' },
  ]

  shortDescription(description: string): string {
    const maxLength = 80
    return description.length > maxLength
      ? `${description.slice(0, maxLength).trimEnd()}...`
      : description
  }

  formatValue(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }

  goToItemRegister(): void {
    this.router.navigate(['/itemRegister'])
  }

  editItem(item: KioskItem): void {
    this.router.navigate(['/itemRegister', item.id])
  }
}
