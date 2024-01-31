// order.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'https://localhost:8084/api/orders';

  constructor(private http: HttpClient) {}

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

  addProductToCart(userId: string, productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/cart/${productId}`, null, {
      responseType: 'text',
    });
  }


  buyProducts(orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/buy/${orderId}`, null, {
      responseType: 'text',
    });
  }
}
