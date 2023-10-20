export class Credentials{
  #username: string;
  #password: string;

  get username(){return this.#username}
  get password(){return this.#password}

  constructor(username: string, password: string){
    this.#username = username;
    this.#password = password;
  }

  JSON(){
    return {
      "username": this.#username,
      "password": this.#password
    }
  }

}