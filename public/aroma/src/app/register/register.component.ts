import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{

  registerGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.registerGroup = this._formBuilder.group({
      name:  "",
      username: "",
      password: "",
      repeated_password: ""
    });
  }

  register(){
    console.log(this.registerGroup.value);
  }



}
