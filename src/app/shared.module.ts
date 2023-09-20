import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CheckForUpdateService } from './services/check-for-update/check-for-update.service';
import { LoaderComponent } from './shared/loader/loader.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects, AppEffects } from './store/app_and_auth/effects';
import {
  appMenuStateReducer,
  appStateReducer,
  styleConfigStateReducer,
} from './store/app_and_auth/reducers/app.reducer';

import {
  authStateReducer,
  appPermissionsReducer,
} from './store/app_and_auth/reducers/auth.reducer';

import { guuidReducer } from './store/guuid/guuid.reducer';
import { userReducer } from './admin/store/user.reducer';
import { AdminEffects } from './admin/store/user.effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    StoreModule.forFeature('app', appStateReducer),
    StoreModule.forFeature('style-config', styleConfigStateReducer),
    StoreModule.forFeature('auth', authStateReducer),
    StoreModule.forFeature('app-permissions', appPermissionsReducer),
    StoreModule.forFeature('app-menu', appMenuStateReducer),
    StoreModule.forFeature('guuid', guuidReducer),
    StoreModule.forFeature('user', userReducer),
    EffectsModule.forFeature([AuthEffects, AppEffects, AdminEffects]),
  ],
  declarations: [LoaderComponent],
  exports: [FormsModule, ReactiveFormsModule, LoaderComponent],
  // providers: [CheckForUpdateService],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
