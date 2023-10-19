export class Chemical{
  #name: string;
  #category: string;


  get name(){return this.#name}
  get category(){return this.#category}

  constructor(name: string, category: string){
    this.#name = name;
    this.#category = category;
  }
}