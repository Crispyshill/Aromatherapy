import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credentials } from './credentials.service';
import { User } from './user.service';
import { Observable } from 'rxjs';
import { JwtToken } from './jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  baseUrl = "http://localhost:3000/api/users";

  constructor(private _httpClient: HttpClient) { }


  verifyCredentials(credential: Credentials): Observable<JwtToken> {
    return this._httpClient.post<JwtToken>(this.baseUrl + "/login", credential.JSON());
  }

  registerUser(newUser: User): Observable<User>{
    console.log("sent new user", newUser.JSON());
    return this._httpClient.post<User>(this.baseUrl, newUser.JSON());
  }



  
}
