import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chemical } from './chemical.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChemicalDataService {
  _baseUrl: string = "http://127.0.0.1:3000/api/essentialoils"

  constructor(private _httpClient: HttpClient) { }

  createOneChemical(_essentialoilId: string, newChemical: Chemical): Observable<Chemical>{
    return this._httpClient.post<Chemical>(this._baseUrl + "/" + _essentialoilId + "/chemicals", newChemical);
  }
}
