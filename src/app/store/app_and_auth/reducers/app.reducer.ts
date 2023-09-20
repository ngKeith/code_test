import { createReducer, on } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';
import {} from 'src/app/shared/service-proxies/service-proxies';
// import AppState from state
import { AppState, AppMenuState, StyleConfigState } from '../app.state';

// Define initial state
export const initialState: AppState = {
  loading: false,
  busy: false,
  error: '',
  success: '',
  message: '',
  warning: '',
  appId: null,
  serverSig: null,
};

export const initialMenuState: AppMenuState = {
  adminMenu: {
    home: {
      goTo: '/admin/lists',
      userType: 'admin',
      label: 'Home',
    },
    'register-admin': {
      goTo: '/admin/register-admin',
      userType: 'admin',
      label: 'Register Admin',
    },
    'register-organization': {
      goTo: '/admin/register-organization',
      userType: 'admin',
      label: 'Register Organization',
    },
    'register-user': {
      goTo: '/admin/register-user',
      userType: 'admin',
      label: 'Register User',
    },
    logout: {
      label: 'Logout',
      function: 'logout()',
    },
  },
  mainMenu: {
    admin: {
      label: 'Admin',
      userType: 'admin',
      goTo: '/admin',
    },
    menuOne: {
      label: 'menu 1',
      goTo: '/',
    },
    logout: {
      label: 'Logout',
      function: 'logout()',
    },
  },
};

export const initialStyleConfigState: StyleConfigState = {
  primary: '',
  secondary: '',
  tertiary: '',
  logo: '',
};

export const styleConfigStateReducer = createReducer(
  initialStyleConfigState,
  on(AppActions.SetOrgStyleConfig, (state, { styleConfig }) => {
    return { ...state, ...styleConfig };
  })
);

export const appStateReducer = createReducer(
  initialState,
  on(AppActions.SetLoading, (state, { loading }) => {
    return {
      ...state,
      loading: loading,
    };
  }),
  on(AppActions.SetBusy, (state, { busy }) => {
    return {
      ...state,
      busy: busy,
    };
  }),
  on(AppActions.SetError, (state, { error }) => {
    return {
      ...state,
      error: error,
    };
  }),
  on(AppActions.SetSuccess, (state, { success }) => {
    return {
      ...state,
      success: success,
    };
  }),
  on(AppActions.SetMessage, (state, { message }) => {
    return {
      ...state,
      message: message,
    };
  }),
  on(AppActions.SetWarning, (state, { warning }) => {
    return {
      ...state,
      warning: warning,
    };
  }),
  on(AppActions.SetAppAuth, (state, { appId, serverSig }) => {
    return {
      ...state,
      appId: appId,
      serverSig: serverSig,
    };
  }),
  on(AppActions.ResetAppStateProperty, (state, { property }) => {
    return {
      ...state,
      [property]: '',
    };
  }),
  on(AppActions.ResetAppStateProperty, (state, { property }) => {
    const newState: AppState = { ...state };
    if (newState.hasOwnProperty(property)) {
      newState[property] = initialState[property];
    }
    return newState;
  })
);

export const appMenuStateReducer = createReducer(initialMenuState);
