import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { User } from '../user.service';
import { Credentials } from '../credentials.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  errorRegistering: boolean = false;
  registrationErrorMessage: string = "Registration failed, please try again.";
  successfullyRegistered: boolean = false;
  registrationSuccessMessage: string = "Successfully registered new user";


  registerGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _userDataService: UserDataService) { }

  ngOnInit(): void {
    this.registerGroup = this._formBuilder.group({
      name: "",
      username: "",
      password: "",
      repeated_password: ""
    });
  }

  register() {
    console.log(this.registerGroup.value);
    if (this.registerGroup.value.password === this.registerGroup.value.repeated_password) {
      const newUser: User = new User("", this.registerGroup.value.name, new Credentials(this.registerGroup.value.username, this.registerGroup.value.password));
      this._userDataService.registerUser(newUser).subscribe({
        next: (registeredUser) => { this.errorRegistering = false; this.successfullyRegistered = true; },
        error: (err) => { console.log(err);this.errorRegistering = true; this.successfullyRegistered = false; }
      });
    }
    else {
      this.errorRegistering = true;
      this.successfullyRegistered = false;
    }
  }



}
