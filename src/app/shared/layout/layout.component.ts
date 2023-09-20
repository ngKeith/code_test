import {
  Component,
  Injector,
  OnInit,
  ElementRef,
  Renderer2,
  Inject,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { ComponentBase } from 'src/app/base.component';
import { Store } from '@ngrx/store';
import { AssignUserAuthDetails } from 'src/app/store/app_and_auth/actions/auth.actions';
import {
  Observable,
  Subscription,
  combineLatest,
  Subject,
  BehaviorSubject,
  of,
} from 'rxjs';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  takeUntil,
} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  authStateSelector,
  selectAppLoading,
  selectAppBusy,
  selectAppError,
  selectAppSuccess,
  selectAppMessage,
  selectAppWarning,
  selectPermissions,
  selectAppMenus,
  selectOrgStyleConfig,
} from 'src/app/store/app_and_auth/selectors';
import {
  AppMenuState,
  AuthState,
  MenuItem,
} from 'src/app/store/app_and_auth/app.state';
import * as AppActions from 'src/app/store/app_and_auth/actions';
import { Actions } from '@ngrx/effects';
import { authState } from 'src/app/store/app_and_auth/reducers/auth.reducer';
import { DOCUMENT } from '@angular/common';

type FunctionName = keyof typeof LayoutComponent.prototype.functionsMap;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      state('out', style({ transform: 'translateX(100%)' })),
      transition('out => in', animate('300ms ease-in')),
      transition('in => out', animate('300ms ease-in')),
    ]),
  ],
})
export class LayoutComponent extends ComponentBase implements OnInit {
  showLayout = true;
  menuOpen = false;
  menuState = 'out';
  area: string = '';

  private readonly subscription: Subscription = new Subscription();
  public userAuthState$: Observable<AuthState>;
  public permissionsList$:
    | Observable<{ [key: string]: boolean } | undefined>
    | undefined;
  public appLoading$: Observable<boolean>;
  public appBusy$: Observable<boolean>;
  public appError$: Observable<string>;
  public appSuccess$: Observable<string>;
  public appMessage$: Observable<string>;
  public appWarning$: Observable<string>;
  public menuState$: Observable<AppMenuState>;
  adminMenu: any;
  mainMenu: any;
  adminMenuKeys: string[] = [];
  mainMenuKeys: string[] = [];
  orgStyleConfig$: Observable<any> = of({});

  private destroy$ = new Subject<void>();
  $menuState: any;

  logoPic: string = '';
  colorsSet = false;

  constructor(
    private router: Router,
    private store: Store,
    injector: Injector,
    toastrService: ToastrService,
    private actions: Actions,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    super(injector, toastrService);
    this.userAuthState$ = this.store.select(authStateSelector);
    this.appLoading$ = this.store.select(selectAppLoading);
    this.appBusy$ = this.store.select(selectAppBusy);
    this.appError$ = this.store.select(selectAppError);
    this.appSuccess$ = this.store.select(selectAppSuccess);
    this.appMessage$ = this.store.select(selectAppMessage);
    this.appWarning$ = this.store.select(selectAppWarning);
    this.menuState$ = this.store.select(selectAppMenus);
  }

  // mapping function specified in menu object
  functionsMap = {
    'logout()': () => this.logout(),
  };

  ngOnInit(): void {
    this.permissionsList$ = this.store.select(selectPermissions).pipe(
      takeUntil(this.destroy$),
      map((permissionsList: { [key: string]: boolean } | undefined) => {
        if (!permissionsList) {
          return {};
        }
        return permissionsList;
      })
    );

    this.menuState$.pipe(takeUntil(this.destroy$)).subscribe((menuState) => {
      this.adminMenu = menuState.adminMenu;
      this.mainMenu = menuState.mainMenu;
      this.adminMenuKeys = Object.keys(this.adminMenu);
      this.mainMenuKeys = Object.keys(this.mainMenu);
    });

    this.router.events
      .pipe(
        filter(
          (event: RouterEvent): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.showLayout = !event.url.includes('account');
        // get first part of url to determine area
        this.area = event.url.includes('admin')
          ? 'admin'
          : event.url.includes('account')
          ? 'account'
          : event.url.includes('agent')
          ? 'agent'
          : event.url.includes('verifier')
          ? 'verify'
          : 'main';

        this.handleAppObservables();
        this.store.dispatch(AppActions.SetLoading({ loading: false }));
      });
    // this.store.dispatch(AppActions.SetLoading({ loading: false }));
    // this.handleAppObservables();
  }

  doAction(menuItem: MenuItem) {
    if (menuItem.hasOwnProperty('goTo')) {
      this.goTo(menuItem.goTo || '');
    } else if (menuItem.hasOwnProperty('function')) {
      const functionName = menuItem.function as FunctionName;
      const functionToExecute = this.functionsMap[functionName];

      if (functionToExecute) {
        functionToExecute();
      } else {
        console.error(`Function ${functionName} not found in the functionsMap`);
      }
    }
  }

  isUserTypeAllowed(
    menuItem: MenuItem,
    userAuthState: AuthState | null | undefined
  ) {
    const userTypeMatch = menuItem.hasOwnProperty('userType')
      ? menuItem.userType === userAuthState?.userType
      : true;
    return userTypeMatch;
  }

  isPermissionAllowed(menuItem: MenuItem, permissionsList: any) {
    const permissionAllowed = menuItem.hasOwnProperty('permission')
      ? permissionsList?.[menuItem.permission || ''] === true
      : true;
    return permissionAllowed;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.menuState = this.menuOpen ? 'in' : 'out';
  }

  logout() {
    const details = authState;
    localStorage.removeItem('currentUser');
    this.store.dispatch(AssignUserAuthDetails({ details }));
    this.toggleMenu();
  }

  goTo(route: string) {
    this.router.navigate([route]);
    this.toggleMenu();
  }

  handleAppObservables() {
    this.userAuthState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        if (!authState.isLoggedIn) {
          if (
            !this.router.url.includes('/account') &&
            this.router.url.substring(0, 2) !== '/?' &&
            this.router.url.length !== 1
          ) {
            this.router.navigate(['/']);
          }
        } else if (authState.isLoggedIn && !authState.details) {
          this.store.dispatch(AppActions.LoginUserOrAdminSuccess());
        } else {
          if (
            authState.userType == 'admin' &&
            this.router.url.includes('/account')
          ) {
            this.router.navigate(['/admin']);
          } else if (
            authState.userType == 'verifier' &&
            this.router.url.includes('/account')
          ) {
            this.router.navigate(['/verify']);
          } else if (
            authState.userType == 'agent' &&
            this.router.url.includes('/account')
          ) {
            this.router.navigate(['/agent']);
          }
        }
        this.store.dispatch(AppActions.SetLoading({ loading: false }));
        return authState;
      });

    this.appLoading$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((loading) => {
        if (loading) {
          // this.store.dispatch(AppActions.ResetAppStateProperty({ property: 'loading' }));
        }
        // console.log('loading:', loading);
        return loading;
      });
    this.appBusy$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((busy) => {
        if (busy) {
          // this.store.dispatch(AppActions.ResetAppStateProperty({ property: 'busy' }));
        }
        // console.log('busy:', busy);
      });
    this.appError$
      .pipe(
        distinctUntilChanged(),
        filter((error: string) => error !== ''),
        takeUntil(this.destroy$)
      )
      .subscribe((error) => {
        if (error) {
          console.log('error:', error);
          if (
            error == 'Error getting reCaptcha token' ||
            error == 'Error initializing app'
          ) {
            this.router.navigate(['/error-page']);
          }
          this.store.dispatch(AppActions.SetLoading({ loading: false }));

          this.error('Error!', error);
          this.store.dispatch(
            AppActions.ResetAppStateProperty({ property: 'error' })
          );
        }
      });
    this.appWarning$
      .pipe(
        distinctUntilChanged(),
        filter((warning: string) => warning !== ''),
        takeUntil(this.destroy$)
      )
      .subscribe((warning) => {
        if (warning) {
          console.log('warning:', warning);
          this.warning('Warning!', warning);
          this.store.dispatch(
            AppActions.ResetAppStateProperty({ property: 'warning' })
          );
        }
      });
    this.appMessage$
      .pipe(
        distinctUntilChanged(),
        filter((message: string) => message !== ''),
        takeUntil(this.destroy$)
      )
      .subscribe((message) => {
        if (message) {
          console.log('message:', message);
          this.info('Info!', message);
          this.store.dispatch(
            AppActions.ResetAppStateProperty({ property: 'message' })
          );
        }
      });
    this.appSuccess$
      .pipe(
        distinctUntilChanged(),
        filter((success: string) => success !== ''),
        takeUntil(this.destroy$)
      )
      .subscribe((success) => {
        if (success) {
          console.log('success:', success);
          this.success('Success!', success);
          this.store.dispatch(
            AppActions.ResetAppStateProperty({ property: 'success' })
          );
        }
      });
  }

  setColors(
    primaryColor: string,
    secondaryColor: string,
    tertiaryColor: string
  ) {
    document.documentElement.style.setProperty('--col-reg', primaryColor);
    document.documentElement.style.setProperty('--col-scnd', secondaryColor);
    document.documentElement.style.setProperty('--col-thrd', tertiaryColor);
    this.colorsSet = true;
  }

  setLogo(logoUrl: string) {
    if (logoUrl == '') {
      this.logoPic = '';
    } else {
      this.logoPic = logoUrl;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    sessionStorage.clear();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
