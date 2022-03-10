  import { Injectable } from '@angular/core';
import { FlightService } from '@flight-workspace/flight-lib';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs';
import * as FlightBookingActions from './flight-booking.actions';


@Injectable()
export class FlightBookingEffects {
  processSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlightBookingActions.flightSearchTriggerd),
      mergeMap(action => [
        FlightBookingActions.filterUpdate({ ...action }),
        FlightBookingActions.flightsLoad({ ...action })
      ])
    )
  );

  loadFlights$ = createEffect(() =>
    /**
     * Stream 1: Action with data payload and type
     * - Trigger
     * - Data Provider
     */
    this.actions$.pipe(
      // Filter
      ofType(FlightBookingActions.flightsLoad),
      /**
       * Stream 2: Backend API call -> Flight Array
       * - Data Provider
       */
      switchMap(action => this.flightService.find(
        action.filter.from,
        action.filter.to,
        action.filter.urgent
      )),
      // Transformation
      map(flights => FlightBookingActions.flightsLoaded({ flights }))
    )
  );

  constructor(
    private actions$: Actions,
    private flightService: FlightService) {}
}
