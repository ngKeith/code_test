import { createReducer, on } from '@ngrx/store';
import { getUserListSuccess, userError, userSuccess } from './user.actions';
import { UserListState } from './user.state';

export const initialUsersState: UserListState = {
  userList: [],
};

export const userReducer = createReducer(
  initialUsersState,
  on(getUserListSuccess, (state, { userList }) => {
    return { ...state, userList: userList };
  }),
  on(userSuccess, (state, { user }) => {
    return { ...state, userList: [...state.userList, user] };
  })
);
