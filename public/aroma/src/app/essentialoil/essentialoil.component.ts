import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Essentialoil } from '../essentialoil.service';
import { EssentialoilDataService } from '../essentialoil-data.service';
import { AuthenticationService } from '../authentication.service';
import { Doshas } from '../doshas.service';
import { NgForm } from '@angular/forms';
import { ChemicalDataService } from '../chemical-data.service';

@Component({
  selector: 'app-essentialoil',
  templateUrl: './essentialoil.component.html',
  styleUrls: ['./essentialoil.component.css']
})
export class EssentialoilComponent implements OnInit{

  @ViewChild("chemicalForm")
  chemicalForm!: NgForm;

  openChemicalForm: boolean = false;

  get isLoggedIn(){return this._authentication.isLoggedIn}

  essentialoil!: Essentialoil;

  constructor(private _activatedRoute: ActivatedRoute, private _essentialoilData: EssentialoilDataService, private _authentication: AuthenticationService, private _router: Router, private _chemicalDataService: ChemicalDataService){}

  ngOnInit(): void {
    this._essentialoilData.getOneEssentialoil(this._activatedRoute.snapshot.params['essentialoilId']).subscribe({
      //TODO the way this was done was to compensate for the backend giving doshas in the wrong format
      next: (essentialoil) => {this.essentialoil = essentialoil},
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

  openForm(){
    this.openChemicalForm = true;
  }

  addChemical(){
    console.log("clicked");
    console.log("name", this.chemicalForm.value.name);
    this._chemicalDataService.createOneChemical(this._activatedRoute.snapshot.params['essentialoilId'], this.chemicalForm.value).subscribe({
      next: (savedChemical) => {console.log("Chemical saved", savedChemical)},
      error: (err) => {console.log("Error creating new chemical", err)}
    })
  }

  onClose(){
    this.openChemicalForm = false;
  }






}
