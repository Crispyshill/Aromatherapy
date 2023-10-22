import { Chemical } from "./chemical.service";
import { Doshas } from "./doshas.service";

export class Essentialoil{
  #_id: string;
  #modernName: string;
  #latinName: string;
  #balancedDoshas: Doshas;
  #chemicals: Chemical[];


  get _id(){return this.#_id}
  get modernName(){return this.#modernName}
  get latinName(){return this.#latinName}
  get balancedDoshas(){return this.#balancedDoshas}
  get chemicals(){return this.#chemicals}

  set _id(_id: string){this.#_id = _id}
  set modernName(modernName: string){this.#modernName = modernName}
  set latinName(latinName: string){this.#latinName = latinName}
  set balancedDoshas(balancedDoshas: Doshas){this.#balancedDoshas = balancedDoshas}
  set chemicals(chemicals: Chemical[]){this.#chemicals = chemicals}

  constructor(id: string, modernName: string, latinName: string, balancedDoshas: Doshas, chemicals: Chemical[]){
    this.#_id = id;
    this.#modernName = modernName;
    this.#latinName = latinName;
    this.#balancedDoshas = balancedDoshas;
    this.#chemicals = chemicals;
  }

  JSON(){
    return {
      "_id": this.#_id,
      "modernName": this.#modernName,
      "latinName": this.#latinName,
      "balancedDoshas": this.#balancedDoshas.JSON(),
      "chemicals": this.#chemicals
    }
  }


}