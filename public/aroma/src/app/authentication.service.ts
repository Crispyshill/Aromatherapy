import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';
import { Credentials } from './credentials.service';
import { Observable } from 'rxjs';
import { User } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _userDataService: UserDataService) { }


  login(credentials: Credentials): Observable<User>{
    const verifyCredentialsObservable = this._userDataService.verifyCredentials(credentials);
    verifyCredentialsObservable.subscribe({
      next: (loggedInUser) => { this.isLoggedIn="true"; console.log("The following user logged in", loggedInUser)},
      error: (err) => {this.isLoggedIn="false"; console.log("Error in user data service", err);}
    });

    return verifyCredentialsObservable;
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

}
