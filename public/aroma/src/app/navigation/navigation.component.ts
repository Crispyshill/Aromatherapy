import { Component } from '@angular/core';
import { Router} from '@angular/router'
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  title: string = environment.title;
  page_home: string = environment.page_home;
  page_essential_oils: string = environment.page_essential_oils;
  page_login: string = environment.page_login;
  page_register: string = environment.page_register;
  page_profile: string = environment.page_profile;
  page_logout: string = environment.page_logout;

  get isLoggedIn(){return this._authentication.isLoggedIn}
  // set isLoggedIn(value: string){this._authentication.isLoggedIn = value}

  constructor(private _router: Router, private _authentication: AuthenticationService){
  }

  onHome(){
    this._router.navigate(['/']);
  }

  logout(){
    this._authentication.logout();
    this._router.navigate(['/']);
  }
}
