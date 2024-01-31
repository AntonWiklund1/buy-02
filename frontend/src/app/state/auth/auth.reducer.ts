import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import Cookies from 'js-cookie';

export interface AuthState {
  userId: string | null;
  username: string | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

// Function to save auth state to cookie
function saveAuthStateToCookie(state: AuthState) {
  Cookies.set('authState', JSON.stringify(state), { expires: 7 }); // expires in 7 days
}

// Function to load auth state from cookie
function loadAuthStateFromCookie(): AuthState {
  const cookie = Cookies.get('authState');
  return cookie ? JSON.parse(cookie) : null;
}

// Load initial state from cookie or set default
export const initialAuthState: AuthState = loadAuthStateFromCookie() || {
  userId: null,
  username: null,
  token: null,
  role: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, state => {
    const newState = { ...state, loading: true, error: null };
    saveAuthStateToCookie(newState);
    return newState;
  }),
  on(AuthActions.loginSuccess, (state, { userId, username, token, role }) => {
    const newState = { ...state, userId, username, token, role, loading: false, error: null };
    saveAuthStateToCookie(newState);
    return newState;
  }),
  on(AuthActions.loginFailure, (state, { error }) => {
    const newState = { ...state, error, loading: false };
    saveAuthStateToCookie(newState);
    return newState;
  }),
  on(AuthActions.logout, () => {
    const newState = initialAuthState;
    saveAuthStateToCookie(newState);
    return newState;
  }),
);