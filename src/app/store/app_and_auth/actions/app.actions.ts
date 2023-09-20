import { createAction, props } from '@ngrx/store';

export enum AppActionTypes {
  setLoading = '[App] Set Loading',
  setBusy = '[App] Set Busy',
  setError = '[App] Set Error',
  setSuccess = '[App] Set Success',
  setWarning = '[App] Set Warning',
  setMessage = '[App] Set Message',
  setAppAuth = '[App] Set App Id',
  checkForAppAuth = '[App] Check For App Authentication',
  getAppId = '[App] Get App Id',
  getServerSig = '[App] Get Server Sig',
  getReCaptchaToken = '[App] Get ReCaptcha Token',
  getReCaptchaTokenFromGoogle = '[App] Get ReCaptcha Token From Server',
  getReCaptchaTokenSuccess = '[App] Get ReCaptcha Token Success',
  resetAppStateProperty = '[App] Reset App State Property',
  initializeApp = '[App] Initialize App',
  initializeAppSuccess = '[App] Initialize App Success',
  initializeMenu = '[App] Initialize Menu',
  setOrgStyleConfig = '[App] Set Org Style Config',
}

export const SetLoading = createAction(
  AppActionTypes.setLoading,
  props<{ loading: boolean }>()
);

export const SetBusy = createAction(
  AppActionTypes.setBusy,
  props<{ busy: boolean }>()
);

export const SetError = createAction(
  AppActionTypes.setError,
  props<{ error: string }>()
);

export const SetSuccess = createAction(
  AppActionTypes.setSuccess,
  props<{ success: string }>()
);

export const SetWarning = createAction(
  AppActionTypes.setWarning,
  props<{ warning: string }>()
);

export const SetMessage = createAction(
  AppActionTypes.setMessage,
  props<{ message: string }>()
);

export const SetAppAuth = createAction(
  AppActionTypes.setAppAuth,
  props<{ appId: string | null; serverSig: string | null }>()
);

export const CheckForAppAuth = createAction(AppActionTypes.checkForAppAuth);

export const GetAppId = createAction(AppActionTypes.getAppId);

export const ResetAppStateProperty = createAction(
  AppActionTypes.resetAppStateProperty,
  props<{ property: string }>()
);

export const GetReCaptchaToken = createAction(AppActionTypes.getReCaptchaToken);

export const GetReCaptchaTokenFromGoogle = createAction(
  AppActionTypes.getReCaptchaTokenFromGoogle
);

export const GetReCaptchaTokenSuccess = createAction(
  AppActionTypes.getReCaptchaTokenSuccess,
  props<{ token: string }>()
);

export const InitializeApp = createAction(
  AppActionTypes.initializeApp,
  props<{ deviceId: string; recaptchaToken: string }>()
);

export const InitializeAppSuccess = createAction(
  AppActionTypes.initializeAppSuccess,
  props<{ appId: string }>()
);

export const InitialilzeMenu = createAction(
  AppActionTypes.initializeMenu,
  props<{ isAdmin: string }>()
);

export const SetOrgStyleConfig = createAction(
  AppActionTypes.setOrgStyleConfig,
  props<{ styleConfig: any }>()
);
