import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOrCard } from './table-or-card';

@Component({
  imports: [TableOrCard],
  template: `
    <ng-template #card></ng-template>
    <app-table-or-card [columns]="columns" [ELEMENT_DATA]="data()" [cardTemplate]="card" emptyMessage="Nenhum registro!" [loading]="loading()" loadingLabel="Carregando registros..."></app-table-or-card>
  `,
})
class TableOrCardHost {
  readonly columns = [{ key: 'name', header: 'Nome' }]
  readonly data = signal<unknown[]>([])
  readonly loading = signal(false)
}

describe('TableOrCard skeleton', () => {
  let fixture: ComponentFixture<TableOrCardHost>;
  const element = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TableOrCardHost);
  });

  async function render(data: unknown[], loading: boolean) {
    fixture.componentInstance.data.set(data);
    fixture.componentInstance.loading.set(loading);
    await fixture.whenStable();
  }

  it('mostra o skeleton em vez da mensagem de lista vazia enquanto carrega', async () => {
    await render([], true);

    expect(element().querySelector('[role="status"]')?.textContent).toContain('Carregando registros...');
    expect(element().querySelector('app-list-skeleton')).toBeTruthy();
    expect(element().textContent).not.toContain('Nenhum registro!');
  });

  it('mantém a lista na tela quando uma atualização acontece com registros', async () => {
    await render([{ name: 'Ana' }], true);

    expect(element().querySelector('app-list-skeleton')).toBeNull();
    expect(element().textContent).toContain('Ana');
  });

  it('mostra a mensagem de lista vazia depois de carregar sem registros', async () => {
    await render([], false);

    expect(element().querySelector('app-list-skeleton')).toBeNull();
    expect(element().textContent).toContain('Nenhum registro!');
  });
});

describe('TableOrCard', () => {
  let component: TableOrCard;
  let fixture: ComponentFixture<TableOrCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableOrCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TableOrCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
