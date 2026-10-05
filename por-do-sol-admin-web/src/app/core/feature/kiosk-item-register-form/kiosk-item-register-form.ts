import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
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
import { KioskItem, KioskItemComplement } from '../../models/kiosk-item';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-kiosk-item-register-form',
  imports: [ReactiveFormsModule, Input, ImageInput, CancelButton, Button, Select, MatSnackBarModule, MatTooltipModule],
  templateUrl: './kiosk-item-register-form.html',
  styleUrl: './kiosk-item-register-form.css',
})
export class KioskItemRegisterForm {
  readonly item = input<KioskItem | null>(null)
  private readonly kioskService = inject(KioskService)
  private readonly selectionService = inject(KioskSelectionService)
  private readonly itemService = inject(KioskItemService)
  private readonly router = inject(Router)
  private readonly snackBar = inject(MatSnackBar)

  readonly kiosks = this.kioskService.kiosks
  readonly kioskNames = computed(() => this.kiosks().map(kiosk => kiosk.name ?? '').filter(Boolean))
  private readonly categoryDialog = viewChild<ElementRef<HTMLDialogElement>>('categoryDialog')
  private readonly successDialog = viewChild<ElementRef<HTMLDialogElement>>('successDialog')
  private readonly removeDialog = viewChild<ElementRef<HTMLDialogElement>>('removeDialog')
  private readonly itemNameInput = viewChild<Input>('itemNameInput')
  readonly onClickCancelButton = output<void>()
  readonly saving = signal(false)
  readonly imagePreview = signal<string | null>(null)
  readonly imageRemoved = signal(false)
  readonly ingredients = signal<string[]>([])
  readonly complements = signal<KioskItemComplement[]>([])
  readonly editingIngredientIndex = signal<number | null>(null)
  readonly editingComplementIndex = signal<number | null>(null)
  readonly placeholderImage = '/assets/images/item-placeholder.svg'
  get previewLastText(): string {
    return this.item()
      ? "Este item será atualizado na aba <span class='text-outline'>Itens</span> após salvar."
      : "Este item aparecerá na aba <span class='text-outline'>Itens</span> após o cadastro."
  }

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
  readonly categoryDraft = new FormControl('', { nonNullable: true, validators: [Validators.required] })

  private readonly formValue = toSignal(this.formFields.valueChanges, {
    initialValue: this.formFields.value,
  })

  readonly previewName = computed(() => this.formValue().name?.trim() || 'Novo item')
  readonly previewCategory = computed(() => this.formValue().category?.trim() || 'Categoria')
  readonly selectedKioskName = computed(() => this.kiosks().find(kiosk => kiosk.id === this.formValue().kioskId)?.name ?? '')
  readonly categoryOptions = computed(() => this.kiosks().find(kiosk => kiosk.id === this.formValue().kioskId)?.categories ?? [])
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

  constructor() {
    effect(() => {
      const item = this.item()
      if (!item) return
      this.formFields.patchValue({
        name: item.name,
        category: item.category,
        kioskId: item.kioskId,
        description: item.description,
        value: item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        image: null,
      })
      this.imagePreview.set(item.imageUrl === this.placeholderImage ? null : item.imageUrl)
      this.imageRemoved.set(false)
      this.ingredients.set([...(item.ingredients ?? [])])
      this.complements.set((item.complements ?? []).map(complement => ({ ...complement })))
    })
  }

  onImageSelected(url: string | null): void {
    this.imagePreview.set(url)
    this.imageRemoved.set(url === null)
  }

  openRemoveDialog(): void {
    if (this.item() && !this.saving()) this.removeDialog()?.nativeElement.showModal()
  }

  closeRemoveDialog(): void {
    this.removeDialog()?.nativeElement.close()
  }

  confirmRemoveItem(): void {
    const item = this.item()
    if (!item || this.saving()) return
    if (!this.itemService.removeItem(item.id)) {
      this.snackBar.open('Não foi possível remover o item. Tente novamente.', undefined, { duration: 3000 })
      return
    }
    this.closeRemoveDialog()
    this.showSuccess('Item removido com sucesso.')
    void this.router.navigate(['/home'])
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  private normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      panelClass: 'item-success-snackbar',
    })
  }

  saveIngredient(showFeedback = true): boolean {
    const name = this.ingredientDraft.value.trim().replace(/\s+/g, ' ')
    if (!name) {
      this.ingredientDraft.setErrors({ required: true })
      this.ingredientDraft.markAsTouched()
      return false
    }

    const index = this.editingIngredientIndex()
    if (this.ingredients().some((item, itemIndex) => itemIndex !== index && this.normalizeName(item) === this.normalizeName(name))) {
      this.ingredientDraft.setErrors({ duplicate: true })
      this.ingredientDraft.markAsTouched()
      return false
    }

    if (index === null) {
      this.ingredients.update(items => [...items, name])
      if (showFeedback) this.showSuccess('Ingrediente adicionado com sucesso.')
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

  saveComplement(showFeedback = true): boolean {
    const name = this.complementNameDraft.value.trim().replace(/\s+/g, ' ')
    if (!name) this.complementNameDraft.setErrors({ required: true })
    const index = this.editingComplementIndex()
    if (name && this.complements().some((item, itemIndex) => itemIndex !== index && this.normalizeName(item.name) === this.normalizeName(name))) {
      this.complementNameDraft.setErrors({ duplicate: true })
    }
    if (this.complementNameDraft.invalid || this.complementValueDraft.invalid) {
      this.complementNameDraft.markAsTouched()
      this.complementValueDraft.markAsTouched()
      return false
    }

    const complement = { name, value: this.parseCurrency(this.complementValueDraft.value) }
    if (index === null) {
      this.complements.update(items => [...items, complement])
      if (showFeedback) this.showSuccess('Complemento adicionado com sucesso.')
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
    this.formFields.controls.category.setValue('')
  }

  selectCategory(name: string): void {
    this.formFields.controls.category.setValue(name)
    this.formFields.controls.category.markAsTouched()
  }

  openCategoryDialog(): void {
    if (!this.formFields.controls.kioskId.value) return
    this.categoryDraft.reset('')
    this.categoryDialog()?.nativeElement.showModal()
  }

  closeCategoryDialog(): void {
    this.categoryDialog()?.nativeElement.close()
    this.categoryDraft.reset('')
  }

  createCategory(): void {
    const name = this.categoryDraft.value.trim().replace(/\s+/g, ' ')
    if (!name) {
      this.categoryDraft.setErrors({ required: true })
      this.categoryDraft.markAsTouched()
      return
    }

    const kioskId = this.formFields.controls.kioskId.value
    if (!this.kioskService.addCategory(kioskId, name)) {
      this.categoryDraft.setErrors({ duplicate: true })
      this.categoryDraft.markAsTouched()
      return
    }

    this.selectCategory(name)
    this.closeCategoryDialog()
    this.showSuccess('Categoria criada com sucesso.')
  }

  private parseCurrency(value: string): number {
    return Number(value.replace(/\./g, '').replace(',', '.'))
  }

  async onSubmit(): Promise<void> {
    if (this.saving()) return
    if (this.editingIngredientIndex() !== null || this.ingredientDraft.value.trim()) {
      if (!this.saveIngredient(false)) return
    }
    if (this.editingComplementIndex() !== null || this.complementNameDraft.value.trim() || this.complementValueDraft.value) {
      if (!this.saveComplement(false)) return
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
    if (!kiosk.categories?.includes(category)) {
      this.formFields.controls.category.setErrors({ required: true })
      this.formFields.controls.category.markAsTouched()
      return
    }

    this.saving.set(true)
    try {
      const currentItem = this.item()
      const imageUrl = image
        ? await this.readImage(image)
        : this.imageRemoved() ? this.placeholderImage : currentItem?.imageUrl ?? this.placeholderImage
      const itemData = {
        kioskId: kiosk.id,
        kioskName: kiosk.name,
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        value: this.parseCurrency(value),
        imageUrl,
        ingredients: [...this.ingredients()],
        complements: [...this.complements()],
      }
      if (currentItem) {
        if (!this.itemService.updateItem(currentItem.id, itemData)) throw new Error('Item não encontrado')
        this.showSuccess('Item atualizado com sucesso.')
        void this.router.navigate(['/home'])
      } else {
        this.itemService.addItem({ ...itemData, id: crypto.randomUUID() })
        this.successDialog()?.nativeElement.showModal()
      }
    } catch {
      this.snackBar.open(this.item() ? 'Não foi possível atualizar o item. Tente novamente.' : 'Não foi possível cadastrar o item. Tente novamente.', undefined, { duration: 3000 })
    } finally {
      this.saving.set(false)
    }
  }

  addAnotherItem(): void {
    this.successDialog()?.nativeElement.close()
    const kioskId = this.formFields.controls.kioskId.value
    this.formFields.reset({ name: '', category: '', kioskId, description: '', value: '', image: null })
    this.imagePreview.set(null)
    this.imageRemoved.set(false)
    this.ingredients.set([])
    this.complements.set([])
    this.cancelIngredientEdit()
    this.cancelComplementEdit()
    this.itemNameInput()?.focusInput()
  }

  goHomeAfterSave(): void {
    this.successDialog()?.nativeElement.close()
    void this.router.navigate(['/home'])
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
