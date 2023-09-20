import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, mergeMap, switchMap, map, filter } from 'rxjs/operators';
import {
  AssignUserAuthDetails,
  CheckForUserOrAdminDetails,
  CheckForUserOrAdminDetailsMissing,
  LoginUserOrAdmin,
  LoginUserOrAdminFailure,
  LoginUserOrAdminSuccess,
  SetBusy,
  SetError,
  VerifyUserToken,
  VerifyUserTokenSuccess,
  GetPermissions,
  GetPermissionsSuccess,
} from '../actions';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import {
  AdminDetailsResponse,
  Login,
  LoginResponse,
  PermissionsResponse,
  Permissions,
  UserDetailsResponse,
  VerifyResponse,
} from 'src/app/shared/service-proxies/service-proxies';
import { of } from 'rxjs';
import { AuthState } from '../app.state';
import { authState } from '../reducers/auth.reducer';
import { selectAuthState } from '../selectors';

@Injectable()
export class AuthEffects {
  checkForUserOrAdminDetails$: any;
  loginUserOrAdmin$: any;
  assignUserAuthDetails$: any;
  assignAdminAuthDetails$: any;
  verifyUserToken$: any;
  getPermissions$: any;
  checkUserOrAdmin$: any;

  constructor(
    private store: Store,
    private actions$: Actions,
    private authService: AuthenticationService
  ) {
    this.checkForUserOrAdminDetails$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CheckForUserOrAdminDetails),
        switchMap(() => {
          const currentUser: AuthState = localStorage.getItem('currentUser')
            ? JSON.parse(localStorage.getItem('currentUser') ?? '{}')
            : authState;
          if (currentUser.isLoggedIn) {
            const details = {
              isLoggedIn: currentUser.isLoggedIn,
              userType: currentUser.userType,
              username: currentUser.username,
              permissions: currentUser.permissions,
              entityId: currentUser.entityId,
              token: currentUser.token,
              details: currentUser.details,
              loginError: currentUser.loginError,
            };
            return of(AssignUserAuthDetails({ details }));
          } else {
            return of(CheckForUserOrAdminDetailsMissing());
          }
        })
      )
    );

    // effect to log in user or admin
    this.loginUserOrAdmin$ = createEffect(() =>
      this.actions$.pipe(
        ofType(LoginUserOrAdmin),

        switchMap((action) =>
          this.authService.login(action.loginDetails).pipe(
            mergeMap((response: LoginResponse) => {
              if (response.code == 200) {
                const details: AuthState = {
                  isLoggedIn: true,
                  userType: response.token_type,
                  username: response.username,
                  // permissions: response.permissions,
                  entityId: response.entityId,
                  token: response.access_token,
                  details: null,
                  loginError: '',
                };

                // set the details to local storage
                localStorage.setItem('currentUser', JSON.stringify(details));

                return of(AssignUserAuthDetails({ details }));
              } else {
                this.store.dispatch(SetBusy({ busy: false }));
                return of(
                  LoginUserOrAdminFailure({
                    loginError: 'Failed to login ',
                  })
                );
              }
            }),
            catchError((error) => {
              this.store.dispatch(SetBusy({ busy: false }));
              return of(
                LoginUserOrAdminFailure({ loginError: 'We cannot Log In' })
              );
            })
          )
        )
      )
    );

    // assign the user details
    this.assignUserAuthDetails$ = createEffect(() =>
      this.actions$.pipe(
        ofType(LoginUserOrAdminSuccess),

        switchMap((response) => {
          return this.store.select(selectAuthState).pipe(
            filter((state) => state.isLoggedIn && state.details == null),
            switchMap((state) => {
              this.store.dispatch(GetPermissions());
              return this.authService.getUserDetails(state.username).pipe(
                mergeMap((detailsResponse: UserDetailsResponse) => {
                  if (detailsResponse.code == 200) {
                    const details: AuthState = {
                      ...state,
                      details: detailsResponse.details,
                      permissions: detailsResponse.details.permissions,
                    };
                    localStorage.setItem(
                      'currentUser',
                      JSON.stringify(details)
                    );
                    this.store.dispatch(SetBusy({ busy: false }));
                    return of(AssignUserAuthDetails({ details }));
                  } else {
                    this.store.dispatch(SetBusy({ busy: false }));
                    return of(
                      SetError({ error: 'failed to get user details' })
                    );
                  }
                }),
                catchError((error) => {
                  this.store.dispatch(SetBusy({ busy: false }));
                  return of(SetError({ error: 'failed to get user details' }));
                })
              );
            })
          );
        })
      )
    );

    this.verifyUserToken$ = createEffect(() =>
      this.actions$.pipe(
        ofType(VerifyUserToken),
        switchMap(() =>
          this.authService.verifyUser().pipe(
            mergeMap((response: VerifyResponse) => {
              if (response.code == 200) {
                return of(VerifyUserTokenSuccess());
              } else {
                return of(SetError({ error: 'failed to verify token' }));
              }
            }),
            catchError((error) => {
              return of(SetError({ error: 'failed to verify token' }));
            })
          )
        )
      )
    );

    this.getPermissions$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GetPermissions),
        switchMap(() =>
          this.authService.getPermissions().pipe(
            map((res: PermissionsResponse) => {
              this.store.dispatch(SetBusy({ busy: false }));
              const permissions: Permissions[] = res.permissions;

              return GetPermissionsSuccess({ permissions });
            }),
            catchError(() => of())
          )
        )
      )
    );
  }
}
