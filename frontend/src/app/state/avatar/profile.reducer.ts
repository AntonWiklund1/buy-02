// avatar/profile.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AvatarActions from './profile.actions';

export interface AvatarState {
  avatarUrl: string;
}

export const initialAvatarState: AvatarState = {
  avatarUrl: 'assets/images/default-avatar.png',
};

export const avatarReducer = createReducer(
  initialAvatarState,
  on(AvatarActions.updateProfilePicture, (state, { url }) => ({ ...state, avatarUrl: url }))
);
