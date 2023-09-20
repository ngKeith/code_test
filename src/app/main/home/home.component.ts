import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, map, of, takeUntil } from 'rxjs';
import { AuthState } from 'src/app/store/app_and_auth/app.state';
import { selectAuthState } from 'src/app/store/app_and_auth/selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public userAuthState$: Observable<AuthState> = of();
  private destroy$ = new Subject<void>();
  private readonly subscription: Subscription = new Subscription();

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    // add a new subscription to check if the user is logged in
    this.userAuthState$ = this.store.select(selectAuthState).pipe(
      takeUntil(this.destroy$),
      map((res) => {
        return res;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);
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
