import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Essentialoil } from './essentialoil.service';
import { Doshas } from './doshas.service';


@Injectable({
  providedIn: 'root'
})
export class EssentialoilDataService {

  #_baseUrl = 'http://localhost:3000/api/essentialoils'

  constructor(private _http: HttpClient) { }

  createEssentialoil(newEssentialoil: Essentialoil): Observable<any>{
    const essentialOilToSend = {
      modernName: newEssentialoil.modernName,
      latinName: newEssentialoil.latinName,
      balancedDoshas: newEssentialoil.balancedDoshas.JSON(),
      chemicals: newEssentialoil.chemicals
    }
    console.log("creating", essentialOilToSend);

    
    return this._http.post(this.#_baseUrl, essentialOilToSend); //{headers: new HttpHeaders({'Content-Type': 'application/json'}) }
  }

  getEssentialoils(queryParams: string): Observable<Essentialoil[]>{
    return this._http.get<Essentialoil[]>(this.#_baseUrl + queryParams);
  }

  //TODO fix the backend so that this gives the doshas in the correct format and switch this to essential oil from any
  getOneEssentialoil(id: string): Observable<Essentialoil>{
    return this._http.get<Essentialoil>(this.#_baseUrl + "/" + id);
  }

  fullUpdateEssentialoil(id: string, updatedEssentialoil: Essentialoil): Observable<any>{
    return this._http.put(this.#_baseUrl + "/" + id, updatedEssentialoil); //{headers: new HttpHeaders({'Content-Type': 'application/json'}) }
  }

  deleteEssentialoil(id: string): Observable<any>{
    return this._http.delete(this.#_baseUrl + "/" + id);
  }

  partialUpdateEssentialoil(id: string, updatedEssentialoil: any): Observable<any>{
    return this._http.patch(this.#_baseUrl + "/" + id, updatedEssentialoil); //{headers: new HttpHeaders({'Content-Type': 'application/json'}) }
  }


}
