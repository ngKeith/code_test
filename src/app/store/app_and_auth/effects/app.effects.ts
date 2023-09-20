import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, from } from 'rxjs';
import { catchError, switchMap, map, take, mergeMap } from 'rxjs/operators';
import {
  CheckForAppAuth,
  GetReCaptchaToken,
  GetReCaptchaTokenFromGoogle,
  GetReCaptchaTokenSuccess,
  InitializeApp,
  SetAppAuth,
  SetBusy,
  SetError,
} from '../actions/app.actions';
import { selectAppAuth } from '../selectors';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { BasicResponse } from 'src/app/shared/service-proxies/service-proxies';

@Injectable()
export class AppEffects {
  checkForAppAuth$: any;
  getReCaptchaToken$: any;
  getReCaptchaTokenFromGoogle$: any;
  initializeApp$: any;

  constructor(
    private store: Store,
    private actions$: Actions,
    private authService: AuthenticationService
  ) {
    this.checkForAppAuth$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CheckForAppAuth),
        switchMap(() =>
          this.store.select(selectAppAuth).pipe(
            take(1),
            map((auth) => {
              const localAppId = localStorage.getItem('appId')
                ? localStorage.getItem('appId')
                : '';
              const localServerSig = localStorage.getItem('serverSig')
                ? localStorage.getItem('serverSig')
                : '';
              if (auth.appId || localAppId) {
                auth.appId = auth.appId ? auth.appId : localAppId;
              } else {
                auth.appId = '';
              }
              if (auth.serverSig || localServerSig) {
                auth.serverSig = auth.serverSig
                  ? auth.serverSig
                  : localServerSig;
              } else {
                auth.serverSig = '';
              }
              return SetAppAuth({
                appId: auth.appId,
                serverSig: auth.serverSig,
              });
            })
          )
        )
      )
    );

    this.getReCaptchaToken$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GetReCaptchaToken),
        switchMap(() => {
          const token = localStorage.getItem('reCaptchaToken')
            ? localStorage.getItem('reCaptchaToken')
            : '';
          if (token) {
            return of(GetReCaptchaTokenSuccess({ token }));
          } else {
            return of(GetReCaptchaTokenFromGoogle());
          }
        })
      )
    );

    this.getReCaptchaTokenFromGoogle$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GetReCaptchaTokenFromGoogle),
        mergeMap(() =>
          from(this.waitForReCaptchaApi()).pipe(
            switchMap(() => this.getReCaptchaTokenPromise()),
            map((token) => {
              localStorage.setItem('reCaptchaToken', token);
              return GetReCaptchaTokenSuccess({ token });
            }),
            catchError((error) => {
              console.error('Error getting reCaptcha token:', error);
              return of(SetError({ error: 'Error getting reCaptcha token' }));
            })
          )
        )
      )
    );

    this.initializeApp$ = createEffect(() =>
      this.actions$.pipe(
        ofType(InitializeApp),
        switchMap(({ deviceId, recaptchaToken }) =>
          this.authService.registerApp(deviceId, recaptchaToken).pipe(
            map((response: BasicResponse) => {
              localStorage.setItem('appId', deviceId);
              localStorage.setItem('serverSig', response.message);
              this.store.dispatch(SetBusy({ busy: false }));
              return SetAppAuth({
                appId: deviceId,
                serverSig: response.message,
              });
            }),
            catchError((error) => {
              this.store.dispatch(SetBusy({ busy: false }));
              console.error('Error initializing app:', error);
              return of(SetError({ error: 'Error initializing app' }));
            })
          )
        )
      )
    );
  }
  private waitForReCaptchaApi(): Promise<void> {
    return new Promise((resolve) => {
      const grecaptchaWindow = window as Window &
        typeof globalThis & { grecaptcha?: any };
      if (grecaptchaWindow.grecaptcha && grecaptchaWindow.grecaptcha.execute) {
        resolve();
      } else {
        const intervalId = setInterval(() => {
          if (
            grecaptchaWindow.grecaptcha &&
            grecaptchaWindow.grecaptcha.execute
          ) {
            clearInterval(intervalId);
            resolve();
          }
        }, 100);
      }
    });
  }

  private getReCaptchaTokenPromise(): Promise<string> {
    return grecaptcha.execute('6Leq66InAAAAACANI7oWuo6ImgB79_U6VsdrxMgQ', {
      action: 'initialize',
    }) as Promise<string>;
  }
}
