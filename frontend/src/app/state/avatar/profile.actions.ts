// state/avatar/profile.actions.ts
import { createAction, props } from '@ngrx/store';

export const updateProfilePicture = createAction(
  '[Profile] Update Profile Picture',
  props<{ url: string }>()
);