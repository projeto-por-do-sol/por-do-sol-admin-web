import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { KioskItemRegisterPage } from './kiosk-item-register-page';
import { KioskItemService } from '../../services/kiosk-item-service';
import { FormSkeleton } from '../../shared/ui/form-skeleton/form-skeleton';
import { CardPreviewSkeleton } from '../../shared/ui/card-preview-skeleton/card-preview-skeleton';

@Component({ selector: 'app-kiosk-item-register-form', template: '' })
class KioskItemRegisterFormStub {
  previewName = () => ''
  previewCategory = () => ''
  previewItems = () => []
  imagePreview = () => null
}

describe('KioskItemRegisterPage enquanto carrega', () => {
  let fixture: ComponentFixture<KioskItemRegisterPage>;
  const loadCatalog = vi.fn<() => Promise<void>>();
  const element = () => fixture.nativeElement as HTMLElement;

  function configure(id: string | null) {
    TestBed.overrideComponent(KioskItemRegisterPage, {
      set: { imports: [FormSkeleton, CardPreviewSkeleton, KioskItemRegisterFormStub], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } } },
        { provide: KioskItemService, useValue: { loadCatalog, allItems: signal([]), getItem: () => ({ id: '1', name: 'Água' }) } },
      ],
    });
  }

  async function render() {
    fixture = TestBed.createComponent(KioskItemRegisterPage);
    await fixture.whenStable();
  }

  beforeEach(() => { loadCatalog.mockReset(); });

  it('mostra o skeleton do formulário e do preview ao editar um item', async () => {
    configure('1');
    loadCatalog.mockReturnValue(new Promise(() => undefined));
    await render();

    expect(element().querySelector('[role="status"]')?.textContent).toContain('Carregando item...');
    expect(element().querySelector('app-form-skeleton')).toBeTruthy();
    expect(element().querySelector('app-card-preview-skeleton')).toBeTruthy();
    expect(element().querySelector('app-kiosk-item-register-form')).toBeNull();
  });

  it('troca o skeleton pelo formulário quando o item chega', async () => {
    configure('1');
    loadCatalog.mockResolvedValue(undefined);
    await render();

    expect(element().querySelector('app-form-skeleton')).toBeNull();
    expect(element().querySelector('app-kiosk-item-register-form')).toBeTruthy();
  });

  it('mostra o erro no lugar do skeleton quando a API falha', async () => {
    configure('1');
    loadCatalog.mockRejectedValue(new Error('falhou'));
    await render();

    expect(element().querySelector('[role="alert"]')).toBeTruthy();
    expect(element().querySelector('app-form-skeleton')).toBeNull();
  });

  it('deixa o carregamento do cardápio com o formulário ao cadastrar um item novo', async () => {
    configure(null);
    await render();

    expect(loadCatalog).not.toHaveBeenCalled();
    expect(element().querySelector('app-form-skeleton')).toBeNull();
    expect(element().querySelector('app-kiosk-item-register-form')).toBeTruthy();
  });
});
