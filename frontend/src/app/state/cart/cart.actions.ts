import { createAction, props } from '@ngrx/store';

export const storeOrderId = createAction(
  '[Cart] Store Order ID',
  props<{ orderId: string }>()
);


