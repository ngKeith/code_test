import { createSelector } from '@ngrx/store';
import { createFeatureSelector } from '@ngrx/store';
import { AuthState, PermissionsListState } from '../app.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggedIn
);

export const selectUserType = createSelector(
  selectAuthState,
  (state: AuthState) => state.userType
);

export const selectUsername = createSelector(
  selectAuthState,
  (state: AuthState) => state.username
);

export const selectPermissionsListState =
  createFeatureSelector<PermissionsListState>('app-permissions');

export const selectMainUserDetails = createSelector(
  selectIsLoggedIn,
  selectUserType,
  selectUsername,
  (isLoggedIn, userType, username) => {
    return {
      isLoggedIn,
      userType,
      username,
    };
  }
);

export const selectPermissions = createSelector(
  selectAuthState,
  (state: AuthState) => state.permissions
);

export const selectEntityId = createSelector(
  selectAuthState,
  (state: AuthState) => state.entityId
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectDetails = createSelector(
  selectAuthState,
  (state: AuthState) => state.details
);

export const selectLoginError = createSelector(
  selectAuthState,
  (state: AuthState) => {
    return {
      loginError: state.loginError,
    };
  }
);

export const authStateSelector = createSelector(
  selectIsLoggedIn,
  selectUserType,
  selectUsername,
  selectPermissions,
  selectEntityId,
  selectToken,
  selectDetails,
  selectLoginError,
  (
    isLoggedIn,
    userType,
    username,
    permissions,
    entityId,
    token,
    details,
    { loginError }
  ) => {
    return {
      isLoggedIn,
      userType,
      username,
      permissions,
      entityId,
      token,
      details,
      loginError,
    };
  }
);

export const selectAppPermissions = createSelector(
  selectPermissionsListState,
  (state: PermissionsListState) => state.permissionsList
);
