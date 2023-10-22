export class Doshas{

  #vata: boolean;
  #pitta: boolean;
  #kapha: boolean;

  get vata(){return this.#vata}
  get pitta(){return this.#pitta}
  get kapha(){return this.#kapha}

  set vata(vata: boolean){this.#vata = vata;}
  set pitta(pitta: boolean){this.#pitta = pitta;}
  set kapha(kapha: boolean){this.#kapha = kapha;}

  constructor(vata: boolean, pitta: boolean, kapha: boolean){
    this.#vata = vata;
    this.#pitta = pitta;
    this.#kapha = kapha;
  }

  JSON() {
    return {
      "vata": this.#vata,
      "pitta": this.#pitta,
      "kapha": this.#kapha
    }
  }
}