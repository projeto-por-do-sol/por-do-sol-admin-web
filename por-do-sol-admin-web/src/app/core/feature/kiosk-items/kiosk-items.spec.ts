import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskItems } from './kiosk-items';
import { KioskSelectionService } from '../../services/kiosk-selection-service';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('KioskItems', () => {
  let component: KioskItems;
  let fixture: ComponentFixture<KioskItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskItems],
    }).compileComponents();

    fixture = TestBed.createComponent(KioskItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters menu items by the selected kiosk', () => {
    const selection = TestBed.inject(KioskSelectionService);
    expect(component.kioskItemService.items().length).toBeGreaterThan(2);

    selection.selectKiosk('kiosk_01');
    expect(component.kioskItemService.items().length).toBeGreaterThan(0);
    expect(component.kioskItemService.items().every(item => item.kioskId === 'kiosk_01')).toBe(true);
  });

  it('shortens long descriptions and formats prices', () => {
    expect(component.shortDescription('Descrição curta')).toBe('Descrição curta');
    expect(component.shortDescription('a'.repeat(81))).toBe(`${'a'.repeat(80)}...`);
    expect(component.formatValue(28.9)).toBe('R$ 28,90');
  });

  it('opens the editor for the selected item', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const button = fixture.nativeElement.querySelector('[aria-label="Editar item Porção de Peixe Frito"]') as HTMLButtonElement;

    expect(button).toBeTruthy();
    button.click();

    expect(navigate).toHaveBeenCalledWith(['/itemRegister', 'item1']);
  });
});
