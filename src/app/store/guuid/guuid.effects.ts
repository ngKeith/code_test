import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as GuuidActions from './guuid.actions';
import { GuuidService } from '@services/guuid/guuid.service';
import { BasicResponse, QRUserDataResponse } from '@shared/service-proxies/service-proxies';

@Injectable()
export class GuuidEffects {

  checkGuuid$: any;
  verifyGuuid$: any;

  constructor(private actions$: Actions, private guuidService: GuuidService) {

    this.checkGuuid$ = createEffect(() => this.actions$.pipe(
      ofType(GuuidActions.checkGuuid),
      mergeMap(action => this.guuidService.getVerificationDetails(action.guuid)
        .pipe(
          map((response: QRUserDataResponse) => {
            return GuuidActions.checkGuuidSuccess({ codeDetails: response.details});
          }),
          catchError(error => of(GuuidActions.checkGuuidFailure({ error })))
        ))
      )
    );

    this.verifyGuuid$ = createEffect(() => this.actions$.pipe(
      ofType(GuuidActions.verifyGuuid),
      mergeMap(action => this.guuidService.verifyCode(action.guuid)
        .pipe(
          map((response: BasicResponse) => {
            if (response.code == 200) {
              return GuuidActions.verifyGuuidSuccess();
            } else {
              return GuuidActions.verifyGuuidFailure({ error: response.message })
            }
          }),
          catchError(error => of(GuuidActions.verifyGuuidFailure({ error })))
        ))
      )
    );
  }
}
