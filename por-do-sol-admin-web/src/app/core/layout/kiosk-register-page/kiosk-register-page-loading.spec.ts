import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { KioskRegisterPage } from './kiosk-register-page';
import { KioskService } from '../../services/kiosk-service';
import { FormSkeleton } from '../../shared/ui/form-skeleton/form-skeleton';
import { CardPreviewSkeleton } from '../../shared/ui/card-preview-skeleton/card-preview-skeleton';

@Component({ selector: 'app-kiosk-register-form', template: '' })
class KioskRegisterFormStub {
  previewName = () => ''
  previewItems = () => []
  previewLastText = () => ''
  imagePreview = () => null
}

describe('KioskRegisterPage enquanto carrega', () => {
  let fixture: ComponentFixture<KioskRegisterPage>;
  const getKioskDetails = vi.fn();
  const element = () => fixture.nativeElement as HTMLElement;

  function configure(id: string | null) {
    TestBed.overrideComponent(KioskRegisterPage, {
      set: { imports: [FormSkeleton, CardPreviewSkeleton, KioskRegisterFormStub], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } } },
        { provide: KioskService, useValue: { ensureKiosks: () => Promise.resolve(), getKioskDetails } },
      ],
    });
  }

  async function render() {
    fixture = TestBed.createComponent(KioskRegisterPage);
    await fixture.whenStable();
  }

  beforeEach(() => { getKioskDetails.mockReset(); });

  it('mostra o skeleton do formulário e do preview no lugar do formulário', async () => {
    configure('1');
    getKioskDetails.mockReturnValue(NEVER);
    await render();

    expect(element().querySelector('[role="status"]')?.textContent).toContain('Carregando quiosque...');
    expect(element().querySelector('app-form-skeleton')).toBeTruthy();
    expect(element().querySelector('app-card-preview-skeleton')).toBeTruthy();
    expect(element().querySelector('app-kiosk-register-form')).toBeNull();
  });

  it('troca o skeleton pelo formulário quando os dados chegam', async () => {
    configure('1');
    getKioskDetails.mockReturnValue(of({ id: 1 }));
    await render();

    expect(element().querySelector('app-form-skeleton')).toBeNull();
    expect(element().querySelector('app-kiosk-register-form')).toBeTruthy();
  });

  it('mostra o erro no lugar do skeleton quando a API falha', async () => {
    configure('1');
    getKioskDetails.mockReturnValue(throwError(() => new Error('falhou')));
    await render();

    expect(element().querySelector('[role="alert"]')).toBeTruthy();
    expect(element().querySelector('app-form-skeleton')).toBeNull();
  });

  it('não mostra o skeleton ao cadastrar um quiosque novo', async () => {
    configure(null);
    await render();

    expect(element().querySelector('app-form-skeleton')).toBeNull();
    expect(element().querySelector('app-kiosk-register-form')).toBeTruthy();
  });
});
