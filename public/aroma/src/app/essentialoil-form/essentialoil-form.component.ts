import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Essentialoil } from '../essentialoil.service';
import { EssentialoilDataService } from '../essentialoil-data.service';
import { ActivatedRoute } from '@angular/router';
import { Doshas } from '../doshas.service';

@Component({
  selector: 'app-essentialoil-form',
  templateUrl: './essentialoil-form.component.html',
  styleUrls: ['./essentialoil-form.component.css']
})
export class EssentialoilFormComponent implements OnInit {

  submitButtonText: string = "Create";

  existingEssentialoil!: Essentialoil;

  ngOnInit(): void {
    if (this._activatedRoute.snapshot.params['essentialoilId']) {
      this._essentialoilDataService.getOneEssentialoil(this._activatedRoute.snapshot.params['essentialoilId']).subscribe({
        //Fix the backend Doshas so that this can return to normal
        next: (foundEssentialOil) => this._initializeFormFromExistingEssentialoil(foundEssentialOil),
        error: (err) => { console.log("Error with essential oil data service while calling get one", err) }
      });
      this.submitButtonText = "Update";
    }

  }

  _initializeFormFromExistingEssentialoil(existingEssentialoil: Essentialoil): void {
    console.log("existing essential oil", existingEssentialoil)
    this.existingEssentialoil = existingEssentialoil;
    this.essentialoilForm.form.patchValue({ "vata": existingEssentialoil.balancedDoshas.vata });
    this.essentialoilForm.form.patchValue({ "pitta": existingEssentialoil.balancedDoshas.pitta});
    this.essentialoilForm.form.patchValue({ "kapha": existingEssentialoil.balancedDoshas.kapha});
    this.essentialoilForm.form.patchValue({ "modernName": existingEssentialoil.modernName });
    this.essentialoilForm.form.patchValue({ "latinName": existingEssentialoil.latinName });
  }

  constructor(private _essentialoilDataService: EssentialoilDataService, private _activatedRoute: ActivatedRoute) { };

  @ViewChild("essentialoilForm")
  essentialoilForm!: NgForm;


  submitForm() {
    if (this.existingEssentialoil) {
      this.updateEssentialoil();
    }
    else {
      this.createEssentialoil();
    }
  }

  updateEssentialoil() {
    const balancedDoshas = this.getBalancedDoshasFromForm();
    const newEssentialoil: Essentialoil = new Essentialoil(this.existingEssentialoil._id, this.essentialoilForm.form.value.modernName, this.essentialoilForm.form.value.latinName, balancedDoshas, this.existingEssentialoil.chemicals);
    const changedAttributes = this.identifyChanges(newEssentialoil);
    if(Object.keys(changedAttributes).length !== 0){
      console.log("Updating essential oil", changedAttributes);
      this._essentialoilDataService.partialUpdateEssentialoil(this.existingEssentialoil._id, changedAttributes).subscribe({
        next: (savedEssentialoil) => {},
        error: (err) => {console.log("There was an error updating", err)}
      });
    }    
  }

  identifyChanges(newEssentialoil: Essentialoil): Object {
    console.log("Form values", this.essentialoilForm.value)
    const changedAttributes: any = {

    }

    if (this.existingEssentialoil.latinName !== newEssentialoil.latinName) {
      changedAttributes.latinName = newEssentialoil.latinName;
    }
    if (this.existingEssentialoil.modernName !== newEssentialoil.modernName) {
      changedAttributes.modernName = newEssentialoil.modernName;
    }
    if (JSON.stringify(this.existingEssentialoil.balancedDoshas) !== JSON.stringify(newEssentialoil.balancedDoshas.JSON())) {
      changedAttributes.balancedDoshas = newEssentialoil.balancedDoshas.JSON();
    }
    return changedAttributes;
  }

  getBalancedDoshasFromForm(): Doshas{
    return new Doshas(this.essentialoilForm.form.value.vata, this.essentialoilForm.form.value.pitta, this.essentialoilForm.form.value.kapha);
  }

  createEssentialoil() {
    const balancedDoshas: Doshas = this.getBalancedDoshasFromForm();
    const newEssentialoil: Essentialoil = new Essentialoil("", this.essentialoilForm.form.value.modernName, this.essentialoilForm.form.value.latinName, balancedDoshas, []);
    console.log("Creating essential oil", newEssentialoil);
    this._essentialoilDataService.createEssentialoil(newEssentialoil).subscribe({
      next: () => { },
      error: () => { }
    });
  }

}
