// src/app/state/auth/auth.selectors.ts

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// Selector to get the entire slice of the auth state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Individual selectors to get pieces of the auth state
export const selectUserId = createSelector(selectAuthState, (state: AuthState) => state.userId);
export const selectUsername = createSelector(selectAuthState, (state: AuthState) => state.username);
export const selectToken = createSelector(selectAuthState, (state: AuthState) => state.token);
export const selectUserRole = createSelector(selectAuthState, (state: AuthState) => state.role);
export const selectAuthError = createSelector(selectAuthState, (state: AuthState) => state.error);
export const selectIsAuthenticated = createSelector(selectAuthState, (state) => !!state.token); // true if token is not null
