import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Help } from './help';

describe('Help', () => {
  let component: Help;
  let fixture: ComponentFixture<Help>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Help],
    }).compileComponents();

    fixture = TestBed.createComponent(Help);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows every category when the search is empty', () => {
    expect(component.filteredCategories()).toHaveLength(component.categories.length);
    expect(component.resultCount()).toBe(component.totalArticles);
  });

  it('searches ignoring accents and case', () => {
    component.searchControl.setValue('FUNCIONARIO');

    expect(component.resultCount()).toBeGreaterThan(0);
    expect(component.filteredCategories().some(category => category.id === 'equipe')).toBe(true);
  });

  it('requires every word of the search to match the same article', () => {
    component.searchControl.setValue('cadastrar funcionario');
    const titles = component.filteredCategories().flatMap(category => category.articles.map(article => article.id));

    expect(titles).toContain('cadastrar-funcionario');
    expect(titles).not.toContain('cadastrar-item');
  });

  it('drops categories without matching articles', () => {
    component.searchControl.setValue('cnpj');

    expect(component.filteredCategories().every(category => category.articles.length > 0)).toBe(true);
    expect(component.filteredCategories().length).toBeLessThan(component.categories.length);
  });

  it('returns no results for an unknown term and restores everything after clearing', () => {
    component.searchControl.setValue('xyzxyz');
    expect(component.resultCount()).toBe(0);

    component.clearSearch();
    expect(component.resultCount()).toBe(component.totalArticles);
  });

  it('has unique article ids', () => {
    const ids = component.categories.flatMap(category => category.articles.map(article => article.id));

    expect(new Set(ids).size).toBe(ids.length);
  });
});
