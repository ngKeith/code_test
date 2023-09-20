import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  Subject,
  Subscription,
  distinctUntilKeyChanged,
  filter,
  map,
  of,
  takeUntil,
} from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthAnAppActions from 'src/app/store/app_and_auth/actions';
import { Actions, ofType } from '@ngrx/effects';
import { AppState, AuthState } from 'src/app/store/app_and_auth/app.state';
import {
  selectAuthState,
  selectLoginError,
  selectAppBusy,
  selectIsLoggedIn,
} from 'src/app/store/app_and_auth/selectors';
import {
  CreateCode,
  Login,
} from 'src/app/shared/service-proxies/service-proxies';
import { authState } from 'src/app/store/app_and_auth/reducers/auth.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  // Create my observables here
  private readonly subscription: Subscription = new Subscription();

  private destroy$ = new Subject<void>();
  public userAuthState$: Observable<AuthState>;
  public loginError$: Observable<{ loginError: string }>;
  public appBusy$: Observable<boolean>;
  loggedInMessage: String = 'Log In';

  subComplete: Subject<void> = new Subject<void>();
  logInComplete: Subject<void> = new Subject<void>();

  constructor(
    private toastr: ToastrService,
    private store: Store,
    private actions: Actions,
    private router: Router
  ) {
    this.userAuthState$ = this.store.select(selectAuthState);
    this.loginError$ = this.store.select(selectLoginError);
    this.appBusy$ = this.store.select(selectAppBusy);
  }

  ngOnInit() {
    window.onbeforeunload = () => this.ngOnDestroy();
    this.handleAllObservables();

    this.store.dispatch(AuthAnAppActions.SetBusy({ busy: false }));
  }

  handleAllObservables() {
    // observable for the error
    this.loginError$ = this.store.select(selectLoginError).pipe(
      takeUntil(this.destroy$),
      filter(
        (error: { loginError: string }) =>
          error.loginError !== null && error.loginError !== ''
      ),
      map((error: { loginError: string }) => error)
    );
  }

  submitted = false;
  pageLoading = false;

  // capture the form control
  loginForm = new FormGroup({
    email: new FormControl('test@testmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('test', Validators.required),
  });

  // validators for the form
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // log in the user here ---
  logInUser() {
    if (this.loginForm.valid) {
      let loginDetails: Login = new Login();
      loginDetails.email = this.loginForm.value.email!;
      loginDetails.password = this.loginForm.value.password!;
      loginDetails.otp = '';

      this.store.dispatch(AuthAnAppActions.LoginUserOrAdmin({ loginDetails }));

      // add a subscription to check when AssignUserAuthDetails is complete then call LoginUserOrAdminSuccess
      this.subscription.add(
        this.actions
          .pipe(
            takeUntil(this.subComplete),
            ofType(AuthAnAppActions.AssignUserAuthDetails)
          )
          .subscribe((res) => {
            this.store.dispatch(AuthAnAppActions.LoginUserOrAdminSuccess());
            this.subComplete.next();
            this.subComplete.complete();
          })
      );

      // add a new subscription to check if the user is logged in
      this.userAuthState$
        .pipe(takeUntil(this.destroy$))
        .subscribe((authState: AuthState) => {
          if (authState.isLoggedIn == true) {
            this.loginForm.reset();

            if (authState.userType == 'admin') {
              this.loggedInMessage = 'Admin Logged In';
              setTimeout(() => {
                this.router.navigate(['users']);
              }, 500);
            } else if (authState.userType == 'agent') {
              this.loggedInMessage = 'Agent Logged In';
              setTimeout(() => {
                this.router.navigate(['home']);
              }, 500);
            }
          }
        });
    } else {
      this.toastr.error('Please enter all fields correctly');
    }
  }

  //kill the subscriptions on destroy
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    sessionStorage.clear();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
