// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {
    }
    //get jwt token
    getJwtToken(username: string, password: string) {
        console.log("getJwtToken", username, password)  ;
        return this.http.post(environment.APIGATEWAYHOST + "/api/auth", { username, password });
      }
      
}
