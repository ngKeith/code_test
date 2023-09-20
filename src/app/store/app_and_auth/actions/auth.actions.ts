import { createAction, props } from '@ngrx/store';
import {
  AdminDetails,
  CreateCode,
  Login,
  LoginResponse,
  Permissions,
  UserDetails,
} from 'src/app/shared/service-proxies/service-proxies';
import { AuthState } from '../app.state';

export enum AuthActionTypes {
  checkForUserOrAdminDetails = '[User | Admin] Check for details',
  checkForUserOrAdminDetailsMissing = '[User | Admin] Check for details failure',
  assignUserAuthDetails = '[User] Assign User details',
  getUserDetails = '[User] Get User details',
  getUserDetailsSuccess = '[User] Get User details success',
  getUserDetailsFailure = '[User] Get User details failure',
  getAdminDetails = '[Admin] Get Admin details',
  getAdminDetailsSuccess = '[Admin] Get Admin details success',
  getAdminDetailsFailure = '[Admin] Get Admin details failure',
  updatePermissions = '[User] Update Permissions',
  loginUserOrAdmin = '[User | Admin] Login',
  loginUserOrAdminSuccess = '[User | Admin] Login Success',
  loginUserOrAdminFailure = '[User | Admin] Login Failure',
  logout = '[User | Admin] Logout',
  verifyUserToken = '[User | Admin] Verify Token',
  verifyUserTokenSuccess = '[User | Admin] Verify Token Success',
  forgotPassword = '[User | Admin] Forgot Password',
  forgotPasswordSuccess = '[User | Admin] Forgot Password Success',
  forgotPasswordFailure = '[User | Admin] Forgot Password Failure',
  getPermissions = '[Permissions] Get Permissions',
  getPermissionsSuccess = '[Permissions] Get Permissions Success',
}

export const CheckForUserOrAdminDetails = createAction(
  AuthActionTypes.checkForUserOrAdminDetails
);

export const CheckForUserOrAdminDetailsMissing = createAction(
  AuthActionTypes.checkForUserOrAdminDetailsMissing
);

export const AssignUserAuthDetails = createAction(
  AuthActionTypes.assignUserAuthDetails,
  props<{
    details: AuthState;
  }>()
);

export const GetUserDetails = createAction(
  AuthActionTypes.getUserDetails,
  props<{ username: string }>()
);

export const GetUserDetailsSuccess = createAction(
  AuthActionTypes.getUserDetailsSuccess,
  props<{ userDetails: UserDetails }>()
);

export const GetUserDetailsFailure = createAction(
  AuthActionTypes.getUserDetailsFailure,
  props<{ error: any }>()
);

export const GetAdminDetails = createAction(
  AuthActionTypes.getAdminDetails,
  props<{ username: string }>()
);

export const GetAdminDetailsSuccess = createAction(
  AuthActionTypes.getAdminDetailsSuccess,
  props<{ userDetails: UserDetails }>()
);

export const GetAdminDetailsFailure = createAction(
  AuthActionTypes.getAdminDetailsFailure,
  props<{ error: any }>()
);

export const UpdatePermissions = createAction(
  AuthActionTypes.updatePermissions,
  props<{ permissions: { [key: string]: boolean } }>()
);

export const LoginUserOrAdmin = createAction(
  AuthActionTypes.loginUserOrAdmin,
  props<{ loginDetails: Login }>()
);

export const LoginUserOrAdminSuccess = createAction(
  AuthActionTypes.loginUserOrAdminSuccess
);

export const LoginUserOrAdminFailure = createAction(
  AuthActionTypes.loginUserOrAdminFailure,
  props<{ loginError: any }>()
);

export const VerifyUserToken = createAction(AuthActionTypes.verifyUserToken);

export const VerifyUserTokenSuccess = createAction(
  AuthActionTypes.verifyUserTokenSuccess
);

export const Logout = createAction(AuthActionTypes.logout);

export const ForgotPassword = createAction(
  AuthActionTypes.forgotPassword,
  props<{ details: CreateCode }>()
);

export const ForgotPasswordSuccess = createAction(
  AuthActionTypes.forgotPasswordSuccess
);

export const ForgotPasswordFailure = createAction(
  AuthActionTypes.forgotPasswordFailure
);

export const GetPermissions = createAction(AuthActionTypes.getPermissions);

export const GetPermissionsSuccess = createAction(
  AuthActionTypes.getPermissionsSuccess,
  props<{ permissions: Permissions[] }>()
);
