
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  userId: string | null;
  username: string | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  userId: "2",
  username: "admin",
  token: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9TRUxMRVIiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTcwNjM1ODg1MCwiZXhwIjoxNzA2NDQ1MjUwfQ.e3A0ARaK3gI7A4bXVwE2YycwOwmBD1vxgJypLTvd1g8",
  role: "ROLE_SELLER",
  loading: false,
  error: null,
  // userId: null,
  // username: null,
  // token: null,
  // role: null,
  // loading: false,
  // error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { userId, username, token, role }) => ({
    ...state,
    userId,
    username,
    token,
    role,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(AuthActions.logout, () => initialAuthState),
  // Handle the updateProfileSuccess action
  on(AuthActions.updateProfileSuccess, (state, { username, role }) => ({
    ...state,
    username,
    role
  })),
  // Add other action handlers as needed
);
