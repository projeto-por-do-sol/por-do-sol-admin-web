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

  it('formats currency as the user types', () => {
    fixture.componentRef.setInput('mask', 'currency');
    fixture.detectChanges();

    component.handleInput('1');
    expect(component.value).toBe('0,01');

    component.handleInput('12345678901');
    expect(component.value).toBe('123.456.789,01');

    component.handleInput('1.234,56');
    expect(component.value).toBe('1.234,56');
  });
});
