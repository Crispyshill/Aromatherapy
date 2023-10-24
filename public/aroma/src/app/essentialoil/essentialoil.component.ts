import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Essentialoil } from '../essentialoil.service';
import { EssentialoilDataService } from '../essentialoil-data.service';
import { AuthenticationService } from '../authentication.service';
import { Doshas } from '../doshas.service';
import { NgForm } from '@angular/forms';
import { ChemicalDataService } from '../chemical-data.service';
import { Chemical } from '../chemical.service';

@Component({
  selector: 'app-essentialoil',
  templateUrl: './essentialoil.component.html',
  styleUrls: ['./essentialoil.component.css']
})
export class EssentialoilComponent implements OnInit{

  @ViewChild("chemicalForm")
  chemicalForm!: NgForm;

  openChemicalForm: boolean = false;

  updatingChemical!: Chemical;

  formUpdatingChemical: boolean = false;

  get isLoggedIn(){return this._authentication.isLoggedIn}

  essentialoil!: Essentialoil;

  constructor(private _activatedRoute: ActivatedRoute, private _essentialoilData: EssentialoilDataService, private _authentication: AuthenticationService, private _router: Router, private _chemicalDataService: ChemicalDataService){}

  ngOnInit(): void {
    this.loadEssentialoil();
  }


  loadEssentialoil(): void{
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

    if(this.formUpdatingChemical){
      this._chemicalDataService.updateOneChemical(this._activatedRoute.snapshot.params['essentialoilId'], new Chemical(this.chemicalForm.value.name, this.chemicalForm.value.category, this.updatingChemical._id)).subscribe({
        next: (updatedChemical) => {console.log("Successfully updated chemical", updatedChemical); this.loadEssentialoil(); this.formUpdatingChemical = false; this.openChemicalForm = false;},
        error: (err) => {console.log("Error updating chemical", err)}
      })
    }
    else{
    this._chemicalDataService.createOneChemical(this._activatedRoute.snapshot.params['essentialoilId'], this.chemicalForm.value).subscribe({
      next: (savedChemical) => {console.log("Chemical saved", savedChemical); this.loadEssentialoil(); this.openChemicalForm = false;},
      error: (err) => {console.log("Error creating new chemical", err)}
    })
  }
  }

  onClose(){
    this.openChemicalForm = false;
    this.formUpdatingChemical = false;
  }



  onDeleteChemical(chemicalId: string){
    console.log("On delete chemical called");
    this._chemicalDataService.deleteOneChemical(this._activatedRoute.snapshot.params['essentialoilId'], chemicalId).subscribe({
      next: (deleteConfirmationRenameMe) => {console.log("Success deleting chemical", deleteConfirmationRenameMe)},
      error: (err) => {console.log("Error deleting chemical", err)}
    })
  }

  onUpdateChemical(chemical: Chemical){
    console.log("On update chemical called");
    this.formUpdatingChemical = true;
    this.updatingChemical = chemical;
    this.openForm();
    setTimeout(() => {this.chemicalForm.form.patchValue({"name": chemical.name});this.chemicalForm.form.patchValue({"category": chemical.category});}, 0);
  }


}
