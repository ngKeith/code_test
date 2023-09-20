import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import {
  Login,
  SecurityServiceProxy,
  PublicServiceProxy,
  AdminServiceProxy,
  AppRegister,
  AppRecaptcha,
  PermissionsResponse,
} from 'src/app/shared/service-proxies/service-proxies';

import { AppConsts } from 'src/app/shared/AppConsts';
import { DbService } from '../pouchdb/crud.service';
import { PushNotificationService } from '../push-notification/push-notification.service';
import { Store } from '@ngrx/store';
import * as AuthAnAppActions from 'src/app/store/app_and_auth/actions';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(
    private securityServiceProxy: SecurityServiceProxy,
    private publicServiceProxy: PublicServiceProxy,
    private adminServiceProxy: AdminServiceProxy,
    private pushService: PushNotificationService,
    public swPush: SwPush,
    public dbService: DbService,
    private store: Store
  ) {}

  login(loginInput: Login) {
    this.store.dispatch(AuthAnAppActions.SetBusy({ busy: true }));
    return this.securityServiceProxy.login(loginInput);
  }

  getUserDetails(username: string) {
    this.store.dispatch(AuthAnAppActions.SetBusy({ busy: true }));
    return this.publicServiceProxy.getUserDetails();
  }

  getAdminDetails(username: string) {
    this.store.dispatch(AuthAnAppActions.SetBusy({ busy: true }));
    return this.adminServiceProxy.getAdminDetails(username);
  }

  verifyUser() {
    this.store.dispatch(AuthAnAppActions.SetBusy({ busy: true }));
    return this.securityServiceProxy.verify();
  }

  registerApp(deviceId: string, recaptchaToken: string) {
    this.store.dispatch(AuthAnAppActions.SetBusy({ busy: true }));
    let registerCreds: AppRegister = new AppRegister();
    registerCreds.appKey = AppConsts.appSignature;
    registerCreds.appId = deviceId;
    registerCreds.recaptchaToken = recaptchaToken;
    return this.securityServiceProxy.register(registerCreds);
  }

  checkRecatcha(body: AppRecaptcha) {
    this.store.dispatch(AuthAnAppActions.SetBusy({ busy: true }));
    return this.securityServiceProxy.checkRecaptcha(body);
  }

  swPushInitialize(signature: string): void {
    if (this.swPush.isEnabled) {
      this.swPush.subscription.subscribe((value) => {
        if (value === null) {
          this.swPush
            .requestSubscription({
              serverPublicKey: AppConsts.VAPID_PUBLIC,
            })
            .then((subscription) => {
              this.pushService
                .sendSubscriptionToTheServer(subscription, signature)
                .subscribe((value) => {
                  navigator.serviceWorker
                    .getRegistration()
                    .then(function (reg) {
                      var options = {
                        body: 'You have successfully subscribed to the <company> notifications',
                        icon: 'assets/icons/logo.png',
                        vibrate: [100, 50, 100],
                      };
                      if (reg)
                        reg.showNotification(
                          'frontend-boilerplate Notifications',
                          options
                        );
                    });
                });
            })
            .catch(console.error);
        }
      });
    }
  }

  getPermissions(): Observable<PermissionsResponse> {
    this.store.dispatch(AuthAnAppActions.SetBusy({ busy: true }));
    return this.adminServiceProxy.getPermissions(AppConsts.appSignature);
  }
}
