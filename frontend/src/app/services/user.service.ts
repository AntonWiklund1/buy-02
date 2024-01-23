import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiCreateUserUrl = 'https://localhost:8443/api/users';
  private apiGetUserUrl = 'https://localhost:8443/api/users';
  private apiLogInUrl = 'https://localhost:8443/api/auth'; // checking out
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