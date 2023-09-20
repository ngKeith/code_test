import {
  AdminDetails,
  UserDetails,
  Permissions,
} from 'src/app/shared/service-proxies/service-proxies';
import { State } from '@ngrx/store';

export interface AuthState {
  isLoggedIn: boolean;
  userType: string;
  username: string;
  permissions?: { [key: string]: boolean };
  entityId?: string | null;
  token: string | null;
  details?: UserDetails | AdminDetails | null;
  loginError: string;
}

export interface AppState {
  loading: boolean;
  busy: boolean;
  error: string;
  success: string;
  message: string;
  warning: string;
  appId: string | null;
  serverSig: string | null;
  [key: string]: boolean | string | null;
}

export interface AppMenuState {
  adminMenu: {
    [key: string]: MenuItem;
  };
  mainMenu: {
    [key: string]: MenuItem;
  };
}

export interface MenuItem {
  label: string;
  goTo?: string;
  userType?: string;
  permission?: string;
  function?: FunctionName;
}

export interface StyleConfigState {
  primary: string;
  secondary: string;
  tertiary: string;
  logo: string;
}

type FunctionName = keyof FunctionsMap;

interface FunctionsMap {
  [key: string]: () => void;
}

export interface PermissionsListState {
  permissionsList: Permissions[];
}
