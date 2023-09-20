import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AdminServiceProxy,
  RegisterUser,
  UserDetailsResponse,
  PermissionsResponse,
  AdminDetailsManyResponse,
  UserDetailsManyResponse,
} from '../../shared/service-proxies/service-proxies';
import { Store } from '@ngrx/store';
import * as AuthAnAppActions from 'src/app/store/app_and_auth/actions';
import { AppConsts } from 'src/app/shared/AppConsts';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(
    private adminServiceProxy: AdminServiceProxy,
    private store: Store
  ) {}

  registerUser(userDetails: RegisterUser): Observable<UserDetailsResponse> {
    // this.store.dispatch(AuthAnAppActions.SetBusy({ busy: true }));
    return this.adminServiceProxy.register(userDetails);
  }

  getPermissions(): Observable<PermissionsResponse> {
    this.store.dispatch(AuthAnAppActions.SetBusy({ busy: true }));
    return this.adminServiceProxy.getPermissions(AppConsts.appSignature);
  }

  getUserList(): Observable<UserDetailsManyResponse> {
    this.store.dispatch(AuthAnAppActions.SetBusy({ busy: true }));
    return this.adminServiceProxy.getUsers();
  }
}
