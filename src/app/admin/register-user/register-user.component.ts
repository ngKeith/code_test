import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as actions from '../store/user.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import { RegisterUser } from 'src/app/shared/service-proxies/service-proxies';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAppBusy } from 'src/app/store/app_and_auth/selectors';
import { SetBusy } from 'src/app/store/app_and_auth/actions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent {
  private destroy$ = new Subject<void>();
  createUserForm: FormGroup;
  public appBusy$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actions$: Actions,
    private store: Store,
    private toastr: ToastrService
  ) {
    this.appBusy$ = this.store.select(selectAppBusy);

    this.createUserForm = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
    });
  }

  goToUsers() {
    this.router.navigate(['users']);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    window.onbeforeunload = () => this.ngOnDestroy();

    // maek the app as not busy
    this.store.dispatch(SetBusy({ busy: false }));

    //reset the form after receiving the success message
    this.actions$
      .pipe(ofType(actions.userSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.createUserForm.reset();

        // show a message
        this.toastr.success('User Created Successfully');
      });

    // listen to the failed action
    this.actions$
      .pipe(ofType(actions.userError), takeUntil(this.destroy$))
      .subscribe(() => {
        // show a message
        this.toastr.error('User Could not be created');
      });
  }

  // submit the form and create the user
  letsCreateUser() {
    const newUser = new RegisterUser({
      ...this.createUserForm.value,
      userType: '"agent"',
      permissions: { '"agent"': true },
    });

    this.store.dispatch(
      actions.createUser({
        user: newUser,
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
