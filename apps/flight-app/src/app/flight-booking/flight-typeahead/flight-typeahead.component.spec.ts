import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { FlightTypeaheadComponent } from './flight-typeahead.component';

describe('FlightTypeaheadComponent', () => {
  let component: FlightTypeaheadComponent;
  let fixture: ComponentFixture<FlightTypeaheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightTypeaheadComponent ],
      imports: [ ReactiveFormsModule, HttpClientModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load flights async', waitForAsync(() => {
    component.flights$.subscribe(flights => {
      expect(flights.length).toBe(2);
    });

    component.control.setValue('Graz');
  }));
});
