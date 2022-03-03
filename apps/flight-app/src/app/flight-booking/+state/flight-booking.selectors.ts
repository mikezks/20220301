import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import { map, pipe } from 'rxjs';
import * as fromFlightBooking from './flight-booking.reducer';

export const selectFlightBookingState = createFeatureSelector<fromFlightBooking.State>(
  fromFlightBooking.flightBookingFeatureKey
);

export const selectFlights = createSelector(
  // Selectors
  selectFlightBookingState,
  // Projector
  state => state.flights
);

export const selectPassengers = createSelector(
  selectFlightBookingState,
  state => state.passenger
);

export const selectBookings = createSelector(
  selectFlightBookingState,
  (state) => state.bookings
);

export const selectUser = createSelector(
  selectFlightBookingState,
  (state) => state.user
);

export const selectActiveUserFlights = createSelector(
  // Selectors
  selectFlights,
  selectBookings,
  selectUser,
  // Projector
  (flights, bookings, user) => {
    const activeUserPassengerId = user.passengerId;
    const activeUserFlightIds = bookings
      .filter(b => b.passengerId === activeUserPassengerId)
      .map(b => b.flightId);
    const activeUserFlights = flights
      .filter(f => activeUserFlightIds.includes(f.id));
    return activeUserFlights;
  }
);

export const selectDelayedRxOperator = () =>
  pipe(
    select(selectFlights),
    map(flights => flights.filter(f => f.delayed))
  );

export const selectItemsByFilter = <T, K>(
  mapFn: (state: T) => Array<K>,
  filterFn: (item: K) => boolean
) =>
    pipe(
      select(mapFn),
      map(arr => arr.filter(filterFn))
    );


export const selectUndo = createSelector(
  selectFlightBookingState,
  state => state.undoFlights
);

export const selectRedo = createSelector(
  selectFlightBookingState,
  state => state.redoFlights
);

export const canUndo = createSelector(
  selectUndo,
  undo => !!undo.length
);

export const canRedo = createSelector(
  selectRedo,
  redo => !!redo.length
);
