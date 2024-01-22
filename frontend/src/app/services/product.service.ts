import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrlGetAllproducts = 'https://164.90.180.143:8443/api/products'; 
  private apiUrlGetProductByUerId = 'https://164.90.180.143:8443/api/products/user/'; 
  private apiUrlAddProduct = 'https://164.90.180.143:8443/api/products'; 
  private apiUrlEditProduct = 'https://164.90.180.143:8443/api/products'; 
  private apiUrlGetProductById = 'https://164.90.180.143:8443/api/products'; 
  private apiUrlDeleteProduct = 'https://164.90.180.143:8443/api/products'; 
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
    return this.http.get<any>(`${this.apiUrlGetProductById}/${id}`);
  }

  deleteProduct(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    });
    return this.http.delete(`${this.apiUrlDeleteProduct}/${id}`, { headers: headers, responseType: 'text' });
  }
}
