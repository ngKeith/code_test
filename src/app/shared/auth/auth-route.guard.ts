import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service'
import { UrlHelper } from '../UrlHelper';
import { Store } from '@ngrx/store';
import { selectAuthState } from '@store/app_and_auth/selectors';
import { filter } from 'rxjs';
import { AuthState } from '@app/store/app_and_auth/app.state';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  currentUser = false;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private store: Store
  ) { }

  private goToLogin(): void {
    UrlHelper.setInitialUrl = location.href;
    this.router.navigate(['account']);
  }

  private canActivateInternal(data: any, state: RouterStateSnapshot): boolean {

    const expectedRole = data.expectedRole;

    this.store.select(selectAuthState).pipe().subscribe((userState: AuthState) => {
        if (
          userState.isLoggedIn &&
          userState.permissions?.hasOwnProperty(expectedRole) &&
          userState.permissions[expectedRole]
        ) {
          this.currentUser = true;
        } else {
          this.goToLogin();
        }
      })
    return this.currentUser;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivateInternal(route.data, state);
  }
}
