import { QuoteDetails } from 'src/app/shared/service-proxies/service-proxies';
import { createAction, props } from '@ngrx/store';

export const checkGuuid = createAction(
  '[Guuid] Check Guuid',
  props<{ guuid: string }>()
);

export const checkGuuidSuccess = createAction(
  '[Guuid] Check Guuid Success',
  props<{ codeDetails: QuoteDetails }>()
);

export const checkGuuidFailure = createAction(
  '[Guuid] Check Guuid Failure',
  props<{ error: string }>()
);

export const verifyGuuid = createAction(
  '[Guuid] Verify Guuid',
  props<{ guuid: string }>()
);

export const verifyGuuidSuccess = createAction('[Guuid] Verify Guuid Success');

export const verifyGuuidFailure = createAction(
  '[Guuid] Verify Guuid Failure',
  props<{ error: string }>()
);

export const resetGuuid = createAction('[Guuid] Reset Guuid');
