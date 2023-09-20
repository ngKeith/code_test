import { createAction, props } from '@ngrx/store';
import {
  UserDetails,
  RegisterUser,
} from 'src/app/shared/service-proxies/service-proxies';

// Get users actions
// ======================================================================================================================================
export const getUserList = createAction('[User List] Get User List');

export const getUserListSuccess = createAction(
  '[User List] Get User List Success',
  props<{ userList: UserDetails[] }>()
);

export const getUserListError = createAction(
  '[User List] Get User List Error',
  props<{ userList: UserDetails[] }>()
);

// Create Users Actions
// ======================================================================================================================================
export const createUser = createAction(
  '[Users] Create a new User',
  props<{ user: RegisterUser }>()
);

export const userSuccess = createAction(
  '[Users] Create a new user success',
  props<{ user: UserDetails }>()
);

export const userError = createAction('[Users] Create a new user error');
