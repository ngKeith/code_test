import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserListState } from './user.state';

export const selectUserListFeature =
  createFeatureSelector<UserListState>('user');

export const selectUserList = createSelector(
  selectUserListFeature,
  (state: UserListState) => state
);
