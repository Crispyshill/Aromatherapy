import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Essentialoil } from './essentialoil.service';


@Injectable({
  providedIn: 'root'
})
export class EssentialoilDataService {

  #_baseUrl = 'http://localhost:3000/api/essentialoils'

  constructor(private _http: HttpClient) { }

  createEssentialoil(newEssentialoil: Essentialoil){
    const essentialOilToSend = {
      modernName: newEssentialoil.modernName,
      latinName: newEssentialoil.latinName,
      balancedDoshas: newEssentialoil.balancedDoshas,
      chemicals: newEssentialoil.chemicals
    }
    console.log("creating", essentialOilToSend);

    
    this._http.post(this.#_baseUrl, essentialOilToSend, {headers: new HttpHeaders({'Content-Type': 'application/json'}) }).subscribe({
      next: (something) =>{console.log("something", something)},
      error: (err) => {console.log(err)},
      complete: () => {}
    });
  }

  getEssentialoils(queryParams: string): Observable<Essentialoil[]>{
    return this._http.get<Essentialoil[]>(this.#_baseUrl + queryParams);
  }

  getOneEssentialoil(id: string): Observable<Essentialoil>{
    return this._http.get<Essentialoil>(this.#_baseUrl + "/" + id);
  }

  fullUpdateEssentialoil(id: string, updatedEssentialoil: Essentialoil){
    this._http.put(this.#_baseUrl + "/" + id, updatedEssentialoil, {headers: new HttpHeaders({'Content-Type': 'application/json'}) });
  }

  deleteEssentialoil(id: string){
    console.log("calling delete on", this.#_baseUrl + "/" + id);
    return this._http.delete(this.#_baseUrl + "/" + id);
  }

  // partialUpdateEssentialoil(id: string, updatedEssentialoil: Essentialoil){

  //   this._http.patch(this.#_baseUrl + "/" + id, updatedEssentialoil); //You need to know if I should only send some of the fields or all of the fields
  // }


}
