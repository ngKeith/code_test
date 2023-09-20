import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/shared/service-proxies/service-proxies';
import * as UserSelectors from '../store/user.selectors';
import * as UserActions from '../store/user.actions';
import { UserListState } from '../store/user.state';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  userList$: Observable<any>;

  private destroy$ = new Subject<void>();
  private readonly subscription: Subscription = new Subscription();

  constructor(private router: Router, private store: Store) {
    this.userList$ = this.store.select(UserSelectors.selectUserList);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    // Dispatch an action to get the users
    this.store.dispatch(UserActions.getUserList());

    // Subscribe to userList$ and handle the emitted data
    this.userList$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      console.log('Received user list:', res);
    });
  }

  // navigate to the register User Component
  goToAddUser() {
    this.router.navigate(['/registerUser']);
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
