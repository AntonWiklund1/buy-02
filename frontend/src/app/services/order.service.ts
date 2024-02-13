
import { take } from 'rxjs/operators';
import { selectUserId } from '../state/auth/auth.selector';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, Observable } from 'rxjs';
import { AppState } from '../state/app.state'; // Adjust according to your project structure
import * as CartActions from '../state/cart/cart.actions'; // Adjust according to your project structure

import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = environment.ORDERMSHOST+'/api/orders';

  constructor(private http: HttpClient,
    private store: Store<AppState>
    ) {}


  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`);
  }

  getOrdersByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  deleteProductFromOrder(orderId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}/${productId}`, {
      responseType: 'text',
    });
  }

  addProductToOrder(orderId: string, productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${orderId}/${productId}`, null, {
      responseType: 'text',
    });
  }

  addProductToCart(userId: string, productId: string) {
    // Assuming selectUserId is correctly implemented to select the userId from the store
    return this.store.select(selectUserId).pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          return of('No user ID found');
        }
        // Retrieve orders and dispatch an action if a cart order is found
        return this.getOrdersByUserId(userId).pipe(
          map((ordersData) => {
            const cartOrder = ordersData.find((order) => order.isInCart);
            if (cartOrder) {
              this.store.dispatch(CartActions.storeOrderId({ orderId: cartOrder.id }));
            }
            // Proceed with adding the product to the cart after dispatching
            return userId;
          }),
          // Switch to the HTTP request Observable
          switchMap(() => this.http.post(`${this.apiUrl}/${userId}/cart/${productId}`, null, { responseType: 'text' }))
        );
      }),
      catchError((error) => {
        // Handle any errors that occur during the process
        console.error('Error adding product to cart', error);
        return of(error);
      })
    );
  }

  buyProducts(orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/buy/${orderId}`, null, {
      responseType: 'text',
    });
  }
}
