import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPreview } from './card-preview';

describe('CardPreview', () => {
  let component: CardPreview;
  let fixture: ComponentFixture<CardPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(CardPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
