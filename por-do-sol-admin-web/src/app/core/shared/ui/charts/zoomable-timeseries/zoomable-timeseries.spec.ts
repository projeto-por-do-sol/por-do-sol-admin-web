import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomableTimeseries } from './zoomable-timeseries';

describe('ZoomableTimeseries', () => {
  let component: ZoomableTimeseries;
  let fixture: ComponentFixture<ZoomableTimeseries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoomableTimeseries],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoomableTimeseries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
