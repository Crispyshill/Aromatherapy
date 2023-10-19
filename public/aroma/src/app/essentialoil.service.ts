import { Chemical } from "./chemical.service";

export class Essentialoil{
  #_id: string;
  #modernName: string;
  #latinName: string;
  #balancedDoshas: string[];
  #chemicals: Chemical[];


  get _id(){return this.#_id}
  get modernName(){return this.#modernName}
  get latinName(){return this.#latinName}
  get balancedDoshas(){return this.#balancedDoshas}
  get chemicals(){return this.#chemicals}

  constructor(id: string, modernName: string, latinName: string, balancedDoshas: string[], chemicals: Chemical[]){
    this.#_id = id;
    this.#modernName = modernName;
    this.#latinName = latinName;
    this.#balancedDoshas = balancedDoshas;
    this.#chemicals = chemicals;
  }


}