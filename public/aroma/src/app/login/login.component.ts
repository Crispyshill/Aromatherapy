import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Credentials } from '../credentials.service';
import { UserDataService } from '../user-data.service';
import { AuthenticationService } from '../authentication.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit{

  creds: Credentials = new Credentials("", "");
  get isLoggedIn(){return this._authenticationService.isLoggedIn}
  errorLoggingIn: boolean = false;
  loginErrorMessage: string = "Error logging in, try a different username or password or maybe there was a backend error";


  @ViewChild("LoginForm")
  form!: NgForm;

  constructor(private _userDataService: UserDataService, private _authenticationService: AuthenticationService){}

  login(form: NgForm){
    console.log(form.value);
    const credentials: Credentials = new Credentials(form.value.username, form.value.password);
    this._authenticationService.login(credentials).subscribe({
      next: (loggedInUser) => {this.errorLoggingIn = false;},
      error: (err) => {this.errorLoggingIn = true}
    })
  }

  ngOnInit(): void {
    setTimeout(()=>{this.form.setValue({username: this.creds.username, password: this.creds.password})}, 0);
  }
}
