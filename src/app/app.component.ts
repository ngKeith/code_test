import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  Subscription,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs';
import { selectAppAuth, selectAuthState } from './store/app_and_auth/selectors';
import {
  CheckForAppAuth,
  CheckForUserOrAdminDetails,
} from './store/app_and_auth/actions';
import { AuthState } from './store/app_and_auth/app.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Angular MasterClass';

  public appAuthState$: Observable<{
    appId: string | null;
    serverSig: string | null;
  }>;

  public userAuthState$: Observable<AuthState>;
  private readonly subscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  constructor(private store: Store, private router: Router) {
    this.appAuthState$ = this.store.select(selectAppAuth);
    this.userAuthState$ = this.store.select(selectAuthState);
  }

  ngOnInit(): void {
    //check the auth state when the app loads
    this.appAuthState$
      .pipe(
        map(
          (appAuthState: { appId: string | null; serverSig: string | null }) =>
            appAuthState.appId
        ),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((appId) => {
        if (appId == null) {
          this.store.dispatch(CheckForAppAuth());
        } else {
          this.store.dispatch(CheckForUserOrAdminDetails());
        }
        // return appId;
      });

    // check the auth state here
    this.userAuthState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        // check if admin or agent and redirect accordingly
        if (authState.isLoggedIn == true) {
          if (authState.userType == 'admin') {
            this.router.navigate(['users']);
          } else if (authState.userType == 'agent') {
            this.router.navigate(['home']);
          }
        } else {
          // head to login page
          this.router.navigate(['login']);
        }
      });
  }

  //destroy all subscriptions
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    sessionStorage.clear();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
