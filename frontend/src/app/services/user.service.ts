import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiCreateUserUrl = environment.APIGATEWAYHOST+ '/api/users';
  private apiGetUserUrl = environment.APIGATEWAYHOST+'/api/users';
  private apiLogInUrl = environment.APIGATEWAYHOST+'/api/auth'; // checking out
  constructor(private http: HttpClient) {}

  // Create a new user with JWT token
  createUser(user: any, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(this.apiCreateUserUrl, user, { headers: headers });
  }

  //get user by id
  getUser(id: any, token: string)  {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiGetUserUrl}/${id}`, { headers: headers });
  }
  
  // Log in a user
  logIn(user: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiLogInUrl, user, { headers: headers});
  }
  //delete user
  deleteProfile(id: any, token: string)  {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiGetUserUrl}/${id}`, { headers: headers, responseType: 'text'  });
  }
  //update user
  updateProfile(id:string, newUser: any, token: string)  {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiGetUserUrl}/${id}`, newUser, { headers: headers, responseType: 'text' });
  }
}