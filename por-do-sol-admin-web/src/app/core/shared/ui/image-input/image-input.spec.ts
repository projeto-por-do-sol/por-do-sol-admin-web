import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageInput } from './image-input';

describe('ImageInput', () => {
  let fixture: ComponentFixture<ImageInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ImageInput, ReactiveFormsModule] }).compileComponents();
    fixture = TestBed.createComponent(ImageInput);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
