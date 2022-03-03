/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Flight } from '@flight-workspace/flight-lib';
import { Store } from '@ngrx/store';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, tap, timer } from 'rxjs';
import * as fromFlightBooking from '../+state';
import { RxConnector } from '../../shared/rx-utils/rx-connector';

interface Filter {
  from: string;
  to: string;
  urgent: boolean;
}

interface LocalState {
  filters: Filter[];
}

const initialLocalState: LocalState = {
  filters: [{
    from: 'Graz',
    to: 'Hamburg',
    urgent: false
  }]
};

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  providers: [ RxConnector, ComponentStore ]
})
export class FlightSearchComponent implements OnInit {

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;
  /* flights$: Observable<Flight[]> = this.store.pipe(
    fromFlightBooking.selectItemsByFilter(
      fromFlightBooking.selectFlights,
      flight => flight.delayed
    )
  ); */
  /* flights$: Observable<Flight[]> = this.store.pipe(
    fromFlightBooking.selectDelayedRxOperator()
  ); */
  flights$: Observable<Flight[]> = this.store.select(fromFlightBooking.selectFlights);
  /* flights$: Observable<Flight[]> = this.store.pipe(
    select(fromFlightBooking.selectActiveUserFlights),
    map(flights => flights.filter(f => f.id < 4))
  ); */

  canUndo$ = this.store.select(fromFlightBooking.canUndo);
  canRedo$ = this.store.select(fromFlightBooking.canRedo);

  // "shopping basket" with selected flights
  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  /**
   * Updater
   */
  addFilter = this.localStore.updater(
    (state, filter: Filter) => ({
      ...state,
      filters: [
        ...state.filters,
        filter
      ]
    })
  );

  /**
   * Selectors
   */
  selectFilters$ = this.localStore.select(
    // Selectors
    // Projector
    state => state.filters
  );

  constructor(
    private store: Store<fromFlightBooking.FlightBookingRootState>,
    private localStore: ComponentStore<LocalState>,
    private rxConnector: RxConnector) {
  }

  ngOnInit() {
    /* this.rxConnector.connect(
      timer(0, 1_000),
      { next: num => console.log(num) }
    ); */
    /* this.rxConnector.connect(
      timer(0, 1_000).pipe(
        tap(num => console.log(num))
      )
    ); */

    this.localStore.setState(initialLocalState);
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.addFilter({
      from: this.from,
      to: this.to,
      urgent: this.urgent
    });

    this.store.dispatch(
      fromFlightBooking.flightsLoad({
        from: this.from,
        to: this.to,
        urgent: this.urgent
      })
    );
  }

  delay(flight: Flight): void {
    this.store.dispatch(
      fromFlightBooking.flightUpdate({ flight: {
        ...flight,
        date: addMinutesToDate(flight.date, 15).toISOString(),
        delayed: true
      }})
    );
  }

  undoFlights() {
    this.store.dispatch(
      fromFlightBooking.flightsUndo()
    );
  }

  redoFlights() {
    this.store.dispatch(
      fromFlightBooking.flightsRedo()
    );
  }
}

export const addMinutesToDate = (date: Date | string, minutes: number): Date => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Date(dateObj.getTime() + minutes * 60 * 1_000);
};
