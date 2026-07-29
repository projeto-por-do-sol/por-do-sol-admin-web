import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Donut } from './donut';

describe('Donut', () => {
  let component: Donut;
  let fixture: ComponentFixture<Donut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Donut],
    }).compileComponents();

    fixture = TestBed.createComponent(Donut);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
