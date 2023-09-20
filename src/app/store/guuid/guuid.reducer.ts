import { createReducer, on } from '@ngrx/store';
import * as GuuidActions from './guuid.actions';
import { GuuidState } from './guuid.state';

export const initialState: GuuidState = {
  guuidDetails: null,
  guuidValidated: false,
  guuidVerified: false,
  error: null
};

export const guuidReducer = createReducer(
  initialState,
  on(GuuidActions.checkGuuidSuccess, (state, action) => ({ ...state, guuidValidated: true, guuidDetails: action.codeDetails })),
  on(GuuidActions.checkGuuidFailure, (state, { error }) => ({ ...state, guuidValidated: false, error })),
  on(GuuidActions.verifyGuuidSuccess, (state) => ({ ...state, guuidVerified: true, guuidValidated: true })),
  on(GuuidActions.verifyGuuidFailure, (state, { error }) => ({ ...state, guuidVerified: false, guuidValidated: false, error })),
  on(GuuidActions.resetGuuid, (state) => ({ ...state, initialState }))
);
