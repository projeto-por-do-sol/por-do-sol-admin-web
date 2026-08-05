import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnLink } from './return-link';

describe('ReturnLink', () => {
  let component: ReturnLink;
  let fixture: ComponentFixture<ReturnLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnLink],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
