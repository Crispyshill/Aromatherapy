import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Essentialoil } from '../essentialoil.service';
import { EssentialoilDataService } from '../essentialoil-data.service';
import { AuthenticationService } from '../authentication.service';
import { Doshas } from '../doshas.service';

@Component({
  selector: 'app-essentialoil',
  templateUrl: './essentialoil.component.html',
  styleUrls: ['./essentialoil.component.css']
})
export class EssentialoilComponent implements OnInit{

  get isLoggedIn(){return this._authentication.isLoggedIn}

  essentialoil!: Essentialoil;

  constructor(private _activatedRoute: ActivatedRoute, private _essentialoilData: EssentialoilDataService, private _authentication: AuthenticationService, private _router: Router){}

  ngOnInit(): void {
    this._essentialoilData.getOneEssentialoil(this._activatedRoute.snapshot.params['essentialoilId']).subscribe({
      //TODO the way this was done was to compensate for the backend giving doshas in the wrong format
      next: (essentialoil) => {essentialoil.balancedDoshas = new Doshas(essentialoil.balancedDoshas.includes("Vata"), essentialoil.balancedDoshas.includes("Pitta"), essentialoil.balancedDoshas.includes("Kapha"));this.essentialoil = essentialoil; console.log("essentialoil", essentialoil)},
      error: (err) => {console.log("Error in essential oil data service", err)},
      complete: () => {}
    })
  }


  onUpdate(){
    if(this.isLoggedIn){
      this._router.navigate(['/essentialoilform/' + this.essentialoil._id]);
    }
    else{
      this._router.navigate(['/login']);
    }
  }




}
