export class Chemical{

  #_id: string;
  #name: string;
  #category: string;


  get _id(){return this.#_id}
  get name(){return this.#name}
  get category(){return this.#category}

  constructor(name: string, category: string, id: string){
    this.#_id = id;
    this.#name = name;
    this.#category = category;
  }
}