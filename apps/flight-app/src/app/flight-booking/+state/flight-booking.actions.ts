import { Flight } from '@flight-workspace/flight-lib';
import { createAction, props } from '@ngrx/store';
import { Filter } from './flight-booking.model';

export const flightSearchTriggerd = createAction(
  '[FlightBooking] Flight search triggered',
  props<{ filter: Filter }>()
);

export const filterUpdate = createAction(
  '[FlightBooking] Filter update',
  props<{ filter: Filter }>()
);

export const flightsLoad = createAction(
  '[FlightBooking] Flights load',
  props<{ filter: Filter }>()
);

export const flightsLoaded = createAction(
  '[FlightBooking] Flights loaded',
  props<{ flights: Flight[] }>()
);

export const flightUpdate = createAction(
  '[FlightBooking] Flights update',
  props<{ flight: Flight }>()
);

/* export const loadFlightBookingsFailure = createAction(
  '[FlightBooking] Load FlightBookings Failure',
  props<{ error: any }>()
); */
