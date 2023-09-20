import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { JwtInterceptor } from './shared/jwt.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './account/login/login.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterUserComponent } from './admin/register-user/register-user.component';
import { UsersComponent } from './admin/users/users.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceProxyModule } from './shared/service-proxies/service-proxy.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { API_BASE_URL as ApiBaseUrl } from 'src/app/shared/service-proxies/service-proxies';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from 'src/app/shared/error.interceptor';
import { LocalStorageService } from './shared/local-storage.service';

import { SharedModule } from './shared.module';

import { ToastrModule } from 'ngx-toastr';
import { SwPush } from '@angular/service-worker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppConsts } from 'src/app/shared/AppConsts';

export function getRemoteServiceBaseUrl(): string {
  return AppConsts.remoteServiceBaseUrl;
}

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    LoginComponent,
    AdminComponent,
    RegisterUserComponent,
    UsersComponent,
    MainComponent,
    HomeComponent,
    LoadingOverlayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    ServiceProxyModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),

    // ShadowRoot,
    SharedModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      trace: true,
    }),
  ],
  providers: [
    { provide: ApiBaseUrl, useFactory: getRemoteServiceBaseUrl },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6Leq66InAAAAACANI7oWuo6ImgB79_U6VsdrxMgQ',
    },
    SwPush,
    LocalStorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
