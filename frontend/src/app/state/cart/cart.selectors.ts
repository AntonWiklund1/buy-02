import { createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';
import { AppState } from '../app.state';

export const selectCartState = (state: AppState) => state.cart;

export const selectOrderId = createSelector(
  selectCartState,
  (cart: CartState) => cart.orderId
);
