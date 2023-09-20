import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AdminService } from 'src/app/services/admin/admin.service';
import * as UserActions from './user.actions';
import {
  SetBusy,
  SetError,
  SetSuccess,
} from 'src/app/store/app_and_auth/actions';
import {
  UserDetails,
  UserDetailsManyResponse,
  UserDetailsResponse,
} from 'src/app/shared/service-proxies/service-proxies';

@Injectable()
export class AdminEffects {
  getUserList$: any;
  registerUser$: any;

  constructor(
    private store: Store,
    private actions$: Actions,
    private adminService: AdminService
  ) {
    // get the users
    this.getUserList$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.getUserList),
        switchMap(() =>
          this.adminService.getUserList().pipe(
            map((res: UserDetailsManyResponse) => {
              const userList: UserDetails[] = res.users;

              return UserActions.getUserListSuccess({ userList });
            }),
            catchError(() => {
              return of(UserActions.getUserListError);
            })
          )
        )
      )
    );

    // create a new user
    this.registerUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.createUser),
        switchMap(({ user }) =>
          this.adminService.registerUser(user).pipe(
            map((res: UserDetailsResponse) => {
              const user = res.details;
              if (res.code !== 200) {
                return UserActions.userError();
              } else {
                return UserActions.userSuccess({ user });
              }
            }),
            catchError(() => {
              this.store.dispatch(UserActions.userError());
              return of();
            })
          )
        )
      )
    );
  }
}
