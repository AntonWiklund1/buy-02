import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { AvatarState } from './profile.reducer';

export const selectAvatarState = (state: AppState) => state.avatar;

export const selectAvatarUrl = createSelector(
  selectAvatarState,
  (avatarState: AvatarState) => avatarState.avatarUrl
);
