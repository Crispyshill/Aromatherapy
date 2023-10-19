import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Credentials } from '../credentials.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit{

  creds: Credentials = new Credentials("", "");

  @ViewChild("LoginForm")
  form!: NgForm;

  login(form: NgForm){
    console.log(form.value);
  }

  ngOnInit(): void {
    setTimeout(()=>{this.form.setValue({username: this.creds.username, password: this.creds.password})}, 0);
  }
}
