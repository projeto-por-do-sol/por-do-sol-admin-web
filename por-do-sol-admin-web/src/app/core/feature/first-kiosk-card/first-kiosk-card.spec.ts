import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { FirstKioskCard } from './first-kiosk-card';

describe('FirstKioskCard', () => {
  it('navigates to the kiosk register page', () => {
    const navigate = vi.fn();
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: { navigate } }] });
    const component = TestBed.runInInjectionContext(() => new FirstKioskCard());
    component.goToKioskRegister();
    expect(navigate).toHaveBeenCalledWith(['kioskRegister']);
  });
});
