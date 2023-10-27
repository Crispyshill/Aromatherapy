import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';
import { Credentials } from './credentials.service';
import { Observable } from 'rxjs';
import { User } from './user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtToken } from './jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _userDataService: UserDataService) { }
  #_jwtHelperService: JwtHelperService = new JwtHelperService();

  login(credentials: Credentials): Observable<JwtToken>{
    console.log("Authentication service recieved login request")
    const verifyCredentials = this._userDataService.verifyCredentials(credentials)
    verifyCredentials.subscribe({
      next: (loggedInUser) => { this.isLoggedIn="true"; this.token = loggedInUser},
      error: (err) => {this.isLoggedIn="false"; console.log("Error in user data service", err);}
    });

    return verifyCredentials;

  }

  get isLoggedIn(): boolean{
    const isLoggedIn = localStorage.getItem("loggedIn");
    if(null === isLoggedIn){
      return false;
    }
    else if("true" === isLoggedIn){
      return true;
    }
    else{
      return false;
    }
  }

  set isLoggedIn(value: string){
    localStorage.setItem("loggedIn", value);
  } 

  get token(): JwtToken{
    const token = localStorage.getItem("token");
    if (null === token){
      return new JwtToken("");
    }
    else{
      return new JwtToken(token);
    }
  }


  set token(token: JwtToken){
    if(true === this.isLoggedIn){
      localStorage.setItem("token", token.token);
    }
    else{
      this.logout();
    }
  }

  logout(){
    localStorage.clear();
  }

}
