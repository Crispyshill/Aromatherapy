import { Credentials } from "./credentials.service";

export class User{

  #_id: string;
  #name: string;
  #credentials: Credentials;

  get _id(){return this.#_id}
  get name(){return this.#name}
  get credentials(){return this.#credentials}

  constructor(_id: string, name: string, credentials: Credentials){
    this.#_id = _id;
    this.#name = name;
    this.#credentials = credentials;
  }

  JSON(){
    return {
      "_id": this.#_id,
      "name": this.#name,
      "username": this.#credentials.username,
      "password": this.#credentials.password
    }
  }

}