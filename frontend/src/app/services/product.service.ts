import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrlGetAllproducts = 'https://localhost:8443/api/products';
  private apiUrlGetProductByUerId = 'https://localhost:8443/api/products/user/';
  private apiUrlAddProduct = 'https://localhost:8443/api/products';
  private apiUrlEditProduct = 'https://localhost:8443/api/products';
  private apiUrlGetProductById = 'https://localhost:8443/api/products';
  private apiUrlDeleteProduct = 'https://localhost:8443/api/products';
  private apiUrlAddProductToFavorite = 'https://localhost:8443/api/users';
  private apiUrlDeleteFromFavorite = 'https://localhost:8443/api/users';
  private id: string | undefined;

  constructor(private http: HttpClient) { }

  getProducts(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrlGetAllproducts, { headers });
  }

  getProductsByUserId(id: string): Observable<any> {
    return this.http.get<any>(this.apiUrlGetProductByUerId + id);
  }

  addProduct(product: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.apiUrlAddProduct, product, { headers });
  }

  editProduct(id: string, product: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrlEditProduct}/${id}`, product, { headers: headers, responseType: 'text' });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlGetProductById}/${id}`).pipe(
      catchError(this.handleError) // Handle errors appropriately
    );
  }

  // Add a handleError method to log and handle errors


  deleteProduct(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrlDeleteProduct}/${id}`, { headers: headers, responseType: 'text' });
  }
  private handleError(error: HttpErrorResponse) {
    // Log the error or display a message to the user
    console.error('Error occurred:', error);
    return throwError(() => new Error('Error fetching product data'));
  }

  addProductToFavorite(userId: string, productId: string): Observable<any> {
    return this.http.post(`${this.apiUrlAddProductToFavorite}/${userId}/updateFavoriteProduct/${productId}`, null, {
      responseType: 'text' // Expecting a text response
    }).pipe(
      catchError(this.handleError) // Handle errors appropriately
    );
  }


  removeFromFavorites(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrlDeleteFromFavorite}/${userId}/deleteFavoriteProduct/${productId}`, {
      responseType: 'text' // Expecting a text response
     }).pipe(
      catchError(this.handleError) // Handle errors appropriately
     );
  }
}
