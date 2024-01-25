import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';

export interface CartState {
  orderId: string | null;
  // ... other states
}

export const initialState: CartState = {
  orderId: null,
  // ... other initial states
};

export const cartReducer = createReducer(
  initialState,
  on(CartActions.storeOrderId, (state, { orderId }) => ({ ...state, orderId }))
);
