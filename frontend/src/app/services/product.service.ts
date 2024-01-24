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
  private id: string | undefined;

  constructor(private http: HttpClient) {}

  getProducts( token: string): Observable<any> {
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

  editProduct(id:string ,product: any, token: string): Observable<any> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    });
    return this.http.put(`${this.apiUrlEditProduct}/${id}`, product, { headers: headers, responseType: 'text' });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlGetProductById}/${id}`).pipe(
      tap(data => console.log('Product Data:', data)), // Log the response
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

  
}
