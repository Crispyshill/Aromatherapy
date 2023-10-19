import { Component, OnInit } from '@angular/core';

import { Essentialoil } from '../essentialoil.service';
import { EssentialoilDataService } from '../essentialoil-data.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-essentialoils',
  templateUrl: './essentialoils.component.html',
  styleUrls: ['./essentialoils.component.css']
})
export class EssentialoilsComponent implements OnInit {

  essentialoils!: Essentialoil[];

  #pageNumber: number = 0;
  #offset: number = 0;

  #defaultCount: number = 10;

  constructor(private _essentialoilData: EssentialoilDataService, private _router: Router) { }

  ngOnInit(): void {
    this._essentialoilData.getEssentialoils("?count=" + this.#defaultCount).subscribe({
      next: (essentialoil) => { this.essentialoils = essentialoil },
      error: (err) => { console.log("Error with essential oil data service", err) },
      complete: () => { }
    });
  }

  onDelete(id: string){
    this._essentialoilData.deleteEssentialoil(id).subscribe({
      next: (renameMe) => {console.log("successfully deleted", renameMe);      const queryParams = "?count=5&offset=" + this.#offset;
      this._essentialoilData.getEssentialoils(queryParams).subscribe({
        next: (essentialoil) => { this.essentialoils = essentialoil },
        error: (err) => { console.log("Error with essential oil data service", err) },
        complete: () => {     
      }
      });}
    });
   
  }

  onNextPage(){
    this.#pageNumber++;
    this.#offset = this.#pageNumber * this.#defaultCount;
    const queryParams = "?count=" +this.#defaultCount +"&offset=" + this.#offset;
    this._essentialoilData.getEssentialoils(queryParams).subscribe({
      next: (essentialoil) => { this.essentialoils = essentialoil },
      error: (err) => { console.log("Error with essential oil data service", err) },
      complete: () => {     this._router.navigate(["/essentialoils"]);
    }
    });
  }

  onPreviousPage(): void{
    console.log("page#", this.#pageNumber)
    if(this.#pageNumber > 0){
    this.#pageNumber--;
    this.#offset = this.#pageNumber * this.#defaultCount;
    }
    let queryParams: string = "?count=" + this.#defaultCount;
    if(this.#offset > 0){
    queryParams = "?count=" + this.#defaultCount + "&offset=" + this.#offset;
    }
    
    this._essentialoilData.getEssentialoils(queryParams).subscribe({
      next: (essentialoil) => { this.essentialoils = essentialoil },
      error: (err) => { console.log("Error with essential oil data service", err) },
      complete: () => { }
    });
    this._router.navigate(["/essentialoils"]);
  
  }



}
