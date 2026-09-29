import { Component, computed, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { KioskService } from '../../services/kiosk-service';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { KioskItemService } from '../../services/kiosk-item-service';
import { PreviewItem } from '../../shared/ui/card-preview/card-preview';
import { Input } from '../../shared/ui/input/input';
import { ImageInput } from '../../shared/ui/image-input/image-input';
import { CancelButton } from '../../shared/ui/cancel-button/cancel-button';
import { Button } from '../../shared/ui/button/button';
import { Select } from '../../shared/ui/select/select';
import { KioskItemComplement } from '../../models/kiosk-item';

@Component({
  selector: 'app-kiosk-item-register-form',
  imports: [ReactiveFormsModule, Input, ImageInput, CancelButton, Button, Select],
  templateUrl: './kiosk-item-register-form.html',
  styleUrl: './kiosk-item-register-form.css',
})
export class KioskItemRegisterForm {
  private readonly kioskService = inject(KioskService)
  private readonly selectionService = inject(KioskSelectionService)
  private readonly itemService = inject(KioskItemService)
  private readonly router = inject(Router)

  readonly kiosks = this.kioskService.kiosks
  readonly kioskNames = computed(() => this.kiosks().map(kiosk => kiosk.name ?? '').filter(Boolean))
  readonly onClickCancelButton = output<void>()
  readonly imagePreview = signal<string | null>(null)
  readonly ingredients = signal<string[]>([])
  readonly complements = signal<KioskItemComplement[]>([])
  readonly editingIngredientIndex = signal<number | null>(null)
  readonly editingComplementIndex = signal<number | null>(null)
  readonly placeholderImage = '/assets/images/item-placeholder.svg'
  readonly previewLastText = "Este item aparecerá na aba <span class='text-outline'>Itens</span> após o cadastro."

  readonly formFields = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    kioskId: new FormControl(this.selectionService.selectedKioskId() ?? '', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    value: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^\d{1,3}(?:\.\d{3})*,\d{2}$/),
        control => !control.value || this.parseCurrency(control.value) > 0 ? null : { min: true },
      ],
    }),
    image: new FormControl<File | null>(null),
  })

  readonly ingredientDraft = new FormControl('', { nonNullable: true, validators: [Validators.required] })
  readonly complementNameDraft = new FormControl('', { nonNullable: true, validators: [Validators.required] })
  readonly complementValueDraft = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(/^\d{1,3}(?:\.\d{3})*,\d{2}$/),
      control => !control.value || this.parseCurrency(control.value) > 0 ? null : { min: true },
    ],
  })

  private readonly formValue = toSignal(this.formFields.valueChanges, {
    initialValue: this.formFields.value,
  })

  readonly previewName = computed(() => this.formValue().name?.trim() || 'Novo item')
  readonly previewCategory = computed(() => this.formValue().category?.trim() || 'Categoria')
  readonly selectedKioskName = computed(() => this.kiosks().find(kiosk => kiosk.id === this.formValue().kioskId)?.name ?? '')
  readonly previewItems = computed<PreviewItem[]>(() => {
    const value = this.formValue()
    const kiosk = this.kiosks().find(k => k.id === value.kioskId)
    const price = this.parseCurrency(value.value ?? '')
    return [
      { label: 'Quiosque', value: kiosk?.name || 'Selecione um quiosque' },
      { label: 'Descrição', value: value.description?.trim() || 'Descrição do item' },
      { label: 'Valor', value: this.formatCurrency(price) },
      { label: 'Ingredientes', value: this.ingredients().join(', ') || 'Nenhum' },
      { label: 'Complementos', value: this.complements().map(item => `${item.name} (${this.formatCurrency(item.value)})`).join(', ') || 'Nenhum' },
    ]
  })

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  saveIngredient(): boolean {
    const name = this.ingredientDraft.value.trim()
    if (!name) {
      this.ingredientDraft.setErrors({ required: true })
      this.ingredientDraft.markAsTouched()
      return false
    }

    const index = this.editingIngredientIndex()
    if (index === null) {
      this.ingredients.update(items => [...items, name])
    } else {
      this.ingredients.update(items => items.map((item, itemIndex) => itemIndex === index ? name : item))
    }
    this.cancelIngredientEdit()
    return true
  }

  editIngredient(index: number): void {
    this.ingredientDraft.setValue(this.ingredients()[index])
    this.editingIngredientIndex.set(index)
  }

  removeIngredient(index: number): void {
    this.ingredients.update(items => items.filter((_, itemIndex) => itemIndex !== index))
    this.cancelIngredientEdit()
  }

  cancelIngredientEdit(): void {
    this.ingredientDraft.reset('')
    this.editingIngredientIndex.set(null)
  }

  saveComplement(): boolean {
    const name = this.complementNameDraft.value.trim()
    if (!name) this.complementNameDraft.setErrors({ required: true })
    if (this.complementNameDraft.invalid || this.complementValueDraft.invalid) {
      this.complementNameDraft.markAsTouched()
      this.complementValueDraft.markAsTouched()
      return false
    }

    const complement = { name, value: this.parseCurrency(this.complementValueDraft.value) }
    const index = this.editingComplementIndex()
    if (index === null) {
      this.complements.update(items => [...items, complement])
    } else {
      this.complements.update(items => items.map((item, itemIndex) => itemIndex === index ? complement : item))
    }
    this.cancelComplementEdit()
    return true
  }

  editComplement(index: number): void {
    const complement = this.complements()[index]
    this.complementNameDraft.setValue(complement.name)
    this.complementValueDraft.setValue(complement.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    this.editingComplementIndex.set(index)
  }

  removeComplement(index: number): void {
    this.complements.update(items => items.filter((_, itemIndex) => itemIndex !== index))
    this.cancelComplementEdit()
  }

  cancelComplementEdit(): void {
    this.complementNameDraft.reset('')
    this.complementValueDraft.reset('')
    this.editingComplementIndex.set(null)
  }

  selectKiosk(name: string): void {
    const kiosk = this.kiosks().find(k => k.name === name)
    const control = this.formFields.controls.kioskId
    control.setValue(kiosk?.id ?? '')
    control.markAsTouched()
  }

  private parseCurrency(value: string): number {
    return Number(value.replace(/\./g, '').replace(',', '.'))
  }

  async onSubmit(): Promise<void> {
    if (this.editingIngredientIndex() !== null || this.ingredientDraft.value.trim()) {
      if (!this.saveIngredient()) return
    }
    if (this.editingComplementIndex() !== null || this.complementNameDraft.value.trim() || this.complementValueDraft.value) {
      if (!this.saveComplement()) return
    }

    for (const field of ['name', 'category', 'description'] as const) {
      const control = this.formFields.controls[field]
      if (!control.value.trim()) control.setErrors({ required: true })
    }

    if (this.formFields.invalid) {
      this.formFields.markAllAsTouched()
      return
    }

    const { name, category, kioskId, description, value, image } = this.formFields.getRawValue()
    const kiosk = this.kiosks().find(k => k.id === kioskId)
    if (!kiosk?.id || !kiosk.name) return

    const imageUrl = image ? await this.readImage(image) : this.placeholderImage
    this.itemService.addItem({
      id: crypto.randomUUID(),
      kioskId: kiosk.id,
      kioskName: kiosk.name,
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      value: this.parseCurrency(value),
      imageUrl,
      ingredients: [...this.ingredients()],
      complements: [...this.complements()],
    })

    await this.router.navigate(['/home'])
  }

  private readImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }
}
