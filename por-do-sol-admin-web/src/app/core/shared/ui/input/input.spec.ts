import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Input } from './input';

describe('Input', () => {
  let component: Input;
  let fixture: ComponentFixture<Input>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Input],
    }).compileComponents();

    fixture = TestBed.createComponent(Input);
    fixture.componentRef.setInput('id', 'test-input');
    fixture.componentRef.setInput('label', 'Teste');
    fixture.componentRef.setInput('name', 'test-input');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
