import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrder } from './create-order';
import { KioskSelectionService } from '../../services/kiosk-selection-service';

describe('CreateOrder', () => {
  let component: CreateOrder;
  let fixture: ComponentFixture<CreateOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters items without changing the sidebar kiosk', () => {
    const sidebarSelection = TestBed.inject(KioskSelectionService);
    sidebarSelection.selectKiosk('kiosk_02');

    component.selectKioskByName('Quiosque teste');

    expect(component.selectedKioskId()).toBe('kiosk_01');
    expect(component.selectedItems().length).toBeGreaterThan(0);
    expect(component.selectedItems().every(item => item.kioskId === 'kiosk_01')).toBe(true);
    expect(sidebarSelection.selectedKioskId()).toBe('kiosk_02');
  });
});
