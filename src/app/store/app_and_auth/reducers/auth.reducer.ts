import { createReducer, on } from '@ngrx/store';
import * as AppActions from '../actions/auth.actions';
import {} from 'src/app/shared/service-proxies/service-proxies';
import { AuthState, PermissionsListState } from '../app.state';

export const authState: AuthState = {
  isLoggedIn: false,
  userType: '',
  username: '',
  permissions: {},
  entityId: null,
  token: null,
  details: null,
  loginError: '',
};

export const initialPermissionsState: PermissionsListState = {
  permissionsList: [],
};

export const authStateReducer = createReducer(
  authState,
  on(AppActions.AssignUserAuthDetails, (state, { details }) => {
    return {
      ...state,
      ...details,
    };
  }),
  on(AppActions.Logout, (state) => {
    return {
      ...state,
      ...authState,
    };
  }),
  on(AppActions.LoginUserOrAdminFailure, (state, { loginError }) => {
    return {
      ...state,
      loginError: loginError,
    };
  })
);

export const appPermissionsReducer = createReducer(
  initialPermissionsState,
  on(AppActions.GetPermissionsSuccess, (state, { permissions }) => {
    return { ...state, permissionsList: permissions };
  })
);
