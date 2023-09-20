import { createSelector } from '@ngrx/store';
import { createFeatureSelector } from '@ngrx/store';
import { GuuidState } from './guuid.state';

export const selectGuuidState = createFeatureSelector<GuuidState>('guuid');

export const selectUsername = createSelector(
  selectGuuidState,
  (state: GuuidState) => state
);
