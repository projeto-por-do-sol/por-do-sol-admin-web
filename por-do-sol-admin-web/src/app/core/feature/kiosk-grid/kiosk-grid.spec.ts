import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { KioskModel } from '../../models/kiosk-model';
import { KioskService } from '../../services/kiosk-service';
import { KioskGrid } from './kiosk-grid';

describe('KioskGrid filters', () => {
  const open: KioskModel = { id: '1', name: 'Aberto', isOpen: true };
  const closed: KioskModel = { id: '2', name: 'Fechado', isOpen: false };

  function setup() {
    const kiosks = signal<KioskModel[]>([]);
    const service = { kiosks: kiosks.asReadonly() } as KioskService;
    return { kiosks, component: new KioskGrid(service, {} as Router) };
  }

  it('updates Todos when the API returns after initialization', () => {
    const { kiosks, component } = setup();
    expect(component.selectedKiosk()).toEqual([]);
    kiosks.set([open, closed]);
    expect(component.selectedKiosk()).toEqual([open, closed]);
  });

  it('keeps the selected filter when data arrives or changes', () => {
    const { kiosks, component } = setup();
    component.onSelectedOption('Fechados');
    expect(component.selectedKiosk()).toEqual([]);
    kiosks.set([open, closed]);
    expect(component.selectedKiosk()).toEqual([closed]);
    kiosks.set([open, { ...closed, isOpen: true }]);
    expect(component.selectedKiosk()).toEqual([]);
  });

  it('returns both open and closed kiosks when switching back to Todos', () => {
    const { kiosks, component } = setup();
    kiosks.set([open, closed]);
    component.onSelectedOption('Abertos');
    expect(component.selectedKiosk()).toEqual([open]);
    component.onSelectedOption('Fechados');
    expect(component.selectedKiosk()).toEqual([closed]);
    component.onSelectedOption('Todos');
    expect(component.selectedKiosk()).toEqual([open, closed]);
  });
});
