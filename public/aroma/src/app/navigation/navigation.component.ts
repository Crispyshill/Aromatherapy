import { Component } from '@angular/core';
import { Router} from '@angular/router'
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  get isLoggedIn(){return this._authentication.isLoggedIn}
  // set isLoggedIn(value: string){this._authentication.isLoggedIn = value}

  constructor(private _router: Router, private _authentication: AuthenticationService){
  }

  onHome(){
    this._router.navigate(['/']);
  }

  logout(){
    this._authentication.isLoggedIn = "false";
    this._router.navigate(['/']);
  }
}
