import { Component, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { HELP_CATEGORIES } from '../../mocks/help-articles';
import { HelpArticle, HelpCategory } from '../../models/help-topic';

const ROLE_LABELS: Record<NonNullable<HelpArticle['minRole']>, string> = {
  gerente: 'Gerente',
  proprietario: 'Proprietário',
}

@Component({
  selector: 'app-help',
  imports: [ReactiveFormsModule],
  templateUrl: './help.html',
  styleUrl: './help.css',
})
export class Help {
  readonly searchControl = new FormControl('', { nonNullable: true })
  readonly searchTerm = toSignal(this.searchControl.valueChanges, { initialValue: '' })

  readonly categories: HelpCategory[] = HELP_CATEGORIES
  readonly totalArticles = this.categories.reduce((total, category) => total + category.articles.length, 0)

  readonly isSearching = computed(() => this.searchTerm().trim().length > 0)

  readonly filteredCategories = computed(() => {
    const words = this.normalize(this.searchTerm()).split(/\s+/).filter(Boolean)
    if (!words.length) return this.categories

    return this.categories
      .map(category => ({
        ...category,
        articles: category.articles.filter(article => {
          const text = this.normalize([category.title, article.title, article.summary, ...article.keywords].join(' '))
          return words.every(word => text.includes(word))
        }),
      }))
      .filter(category => category.articles.length > 0)
  })

  readonly resultCount = computed(() =>
    this.filteredCategories().reduce((total, category) => total + category.articles.length, 0))

  roleLabel(article: HelpArticle): string | null {
    return article.minRole ? ROLE_LABELS[article.minRole] : null
  }

  clearSearch(): void {
    this.searchControl.setValue('')
  }

  scrollToCategory(categoryId: string): void {
    document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  private normalize(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
  }
}
