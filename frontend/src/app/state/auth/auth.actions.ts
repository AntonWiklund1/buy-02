import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ userId: string; username: string; token: string; role: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);
export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ username: string; role: string; }>()
);
export const logout = createAction('[Auth] Logout');
