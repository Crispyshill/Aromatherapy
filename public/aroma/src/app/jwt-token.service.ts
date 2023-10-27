import { JwtHelperService } from "@auth0/angular-jwt";

export class JwtToken{
  token: string;

  #_jwtHelperService: JwtHelperService = new JwtHelperService();


  constructor(token: string){
    this.token = token;
  }

  get name(): string{return this.#_jwtHelperService.decodeToken(this.token).name}
}