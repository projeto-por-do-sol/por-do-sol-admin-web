import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipMultiChoice } from './chip-multi-choice';

describe('ChipMultiChoice', () => {
  let component: ChipMultiChoice;
  let fixture: ComponentFixture<ChipMultiChoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipMultiChoice],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipMultiChoice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
