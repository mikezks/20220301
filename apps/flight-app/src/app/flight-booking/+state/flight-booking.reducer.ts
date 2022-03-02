import { Flight } from '@flight-workspace/flight-lib';
import { createReducer, on } from '@ngrx/store';
import * as FlightBookingActions from './flight-booking.actions';

export const flightBookingFeatureKey = 'flightBooking';

interface Todo {
  id: number;
  title: string;
  status: 'done' | 'inprogress' | 'init';
}

const todos: Record<number, Todo> = {
  1: {
    id: 1,
    title: 'do some coding',
    status: 'inprogress'
  },
  2: {
    id: 2,
    title: 'dev ops',
    status: 'init'
  }
};

interface EntityState<T> {
  entities: Record<number, T>;
  id: number[];
}

const devOps = todos[2];

const entityStateTodos: EntityState<Todo> = {
  entities: todos,
  id: [2, 1]
}

const coding = entityStateTodos.entities[1];


export interface State {
  flights: Flight[];
  passenger: Record<
    number,
    {
      id: number,
      name: string,
      firstName: string
    }>;
  bookings: {
    passengerId: number,
    flightId: number
  }[];
  user: {
    name: string,
    passengerId: number
  };
}

export const initialState: State = {
  flights: [],
  passenger: {
    1: { id: 1, name: 'Smith', firstName: 'Anne' }
  },
  bookings: [
    { passengerId: 1, flightId: 3 },
    { passengerId: 1, flightId: 4 },
    { passengerId: 1, flightId: 5 }
  ],
  user: { name: 'anne.smith', passengerId: 1 }
};

export interface FlightBookingRootState {
  flightBooking: State;
}

export const reducer = createReducer(
  initialState,

  on(FlightBookingActions.flightsLoaded, (state, action) => {
    const flights = action.flights;
    return { ...state, flights };
  }),
  on(FlightBookingActions.flightUpdate, (state, action) => {
    const flights = state.flights.map(f => f.id === action.flight.id ? action.flight : f);
    return { ...state, flights };
  }),

);
