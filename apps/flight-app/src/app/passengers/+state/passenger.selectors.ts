import { createFeatureSelector } from "@ngrx/store";
import * as fromPassenger from "./passenger.reducer";

export const selectPassengerState = createFeatureSelector<fromPassenger.State>(fromPassenger.passengersFeatureKey);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = fromPassenger.adapter.getSelectors(selectPassengerState);
