import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  get name(): string {return this._authenticationService.token.name}
  user_greeting: string = environment.message_user_greeting;

  constructor(private _authenticationService: AuthenticationService){}

}
