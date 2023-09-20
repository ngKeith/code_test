import { createSelector, select } from '@ngrx/store';
import { createFeatureSelector } from '@ngrx/store';
import { AppState, AppMenuState, MenuItem } from '../app.state';

export const selectAppState = createFeatureSelector<AppState>('app');
export const selectMenuState = createFeatureSelector<AppMenuState>('app-menu');
export const selectStyleState =
  createFeatureSelector<AppMenuState>('style-config');

export const selectAppLoading = createSelector(
  selectAppState,
  (state: { loading: boolean }) => state.loading
);

export const selectAppBusy = createSelector(
  selectAppState,
  (state: { busy: boolean }) => state.busy
);

export const selectAppError = createSelector(
  selectAppState,
  (state: { error: string }) => state.error
);

export const selectAppSuccess = createSelector(
  selectAppState,
  (state: { success: string }) => state.success
);

export const selectAppMessage = createSelector(
  selectAppState,
  (state: { message: string }) => state.message
);

export const selectAppWarning = createSelector(
  selectAppState,
  (state: { warning: string }) => state.warning
);

export const selectAppAuth = createSelector(
  selectAppState,
  (state: { appId: string | null; serverSig: string | null }) => {
    return {
      appId: state.appId,
      serverSig: state.serverSig,
    };
  }
);

export const selectOrgStyleConfig = createSelector(
  selectStyleState,
  (state: any) => {
    return { ...state };
  }
);

export const AppStateSelector = createSelector(
  selectAppLoading,
  selectAppBusy,
  selectAppError,
  selectAppSuccess,
  selectAppMessage,
  selectAppWarning,
  selectAppAuth,
  (loading, busy, error, success, message, warning, { appId, serverSig }) => {
    return {
      loading,
      busy,
      error,
      success,
      message,
      warning,
      appId,
      serverSig,
    };
  }
);

export const selectAppMenus = createSelector(
  selectMenuState,
  (state: {
    adminMenu: {
      [key: string]: MenuItem;
    };
    mainMenu: {
      [key: string]: MenuItem;
    };
  }) => {
    return {
      adminMenu: state.adminMenu,
      mainMenu: state.mainMenu,
    };
  }
);
