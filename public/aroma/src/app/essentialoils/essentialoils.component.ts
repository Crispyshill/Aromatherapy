import { Component, OnInit } from '@angular/core';

import { Essentialoil } from '../essentialoil.service';
import { EssentialoilDataService } from '../essentialoil-data.service';
import { Router, NavigationExtras } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-essentialoils',
  templateUrl: './essentialoils.component.html',
  styleUrls: ['./essentialoils.component.css']
})
export class EssentialoilsComponent implements OnInit {

  essentialoils!: Essentialoil[];

  get isLoggedIn() { return this._authentication.isLoggedIn }

  #pageNumber: number = 0;

  #defaultCount: number = 5;

  constructor(private _essentialoilData: EssentialoilDataService, private _router: Router, private _authentication: AuthenticationService) { }

  ngOnInit(): void {
    this.loadFirstPage();
  }

  onDelete(id: string) {
    this._essentialoilData.deleteEssentialoil(id).subscribe({
      next: (renameMe) => {
        console.log("successfully deleted", renameMe); const queryParams = "?count=5&offset=" + this.#pageNumber * this.#defaultCount;
        this._essentialoilData.getEssentialoils(queryParams).subscribe({
          next: (essentialoil) => { this.essentialoils = essentialoil },
          error: (err) => { console.log("Error with essential oil data service", err) },
          complete: () => {
          }
        });
      }
    });

  }

  loadFirstPage(): void{
    this._essentialoilData.getEssentialoils("?count=" + this.#defaultCount).subscribe({
      next: (essentialoil) => { this.essentialoils = essentialoil },
      error: (err) => { console.log("Error with essential oil data service", err) },
      complete: () => { }
    });
  }

  onNextPage() {
    this.#pageNumber++;
    const queryParams = "?count=" + this.#defaultCount + "&offset=" + this.#pageNumber * this.#defaultCount;
    this._essentialoilData.getEssentialoils(queryParams).subscribe({
      next: (essentialoils) => { if(essentialoils.length === 0){this.#pageNumber--;}else{this.essentialoils = essentialoils }},
      error: (err) => { console.log("Error with essential oil data service", err) },
      complete: () => {
        this._router.navigate(["/essentialoils"]);
      }
    });
  }

  onPreviousPage(): void {
    console.log("this page number", this.#pageNumber)
    if(this.#pageNumber > 1){
    this.#pageNumber--;
    let queryParams: string = "?count=" + this.#defaultCount + "&offset=" + this.#pageNumber*this.#defaultCount;
    this._essentialoilData.getEssentialoils(queryParams).subscribe({
      next: (essentialoils) => {this.essentialoils = essentialoils },
      error: (err) => { console.log("Error with essential oil data service", err) },
      complete: () => { }
    });
    this._router.navigate(["/essentialoils"]);
  }
  else if(this.#pageNumber === 1){
    this.#pageNumber = 0;
    this.loadFirstPage();
  }

  }

  onCreateClick() {
    if (this.isLoggedIn) {
      this._router.navigate(["/essentialoilform"]);
    }
    else{
      this._router.navigate(['/login']);
    }
  }



}
