import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Essentialoil } from '../essentialoil.service';
import { EssentialoilDataService } from '../essentialoil-data.service';
import { ActivatedRoute } from '@angular/router';
import { Doshas } from '../doshas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-essentialoil-form',
  templateUrl: './essentialoil-form.component.html',
  styleUrls: ['./essentialoil-form.component.css']
})
export class EssentialoilFormComponent implements OnInit {

  submitButtonText: string = environment.button_submit;

  existingEssentialoil!: Essentialoil;

  get updatingEssentialOil(): boolean { if (this._activatedRoute.snapshot.params['essentialoilId']) { return true; } else { return false; } }
  errorUpdating: boolean = false;
  errorCreating: boolean = false;
  successfulUpdate: boolean = false;
  successfulCreate: boolean = false;


  modern_name_pre: string = environment.message_modern_name_pre;
  latin_name_pre: string = environment.message_latin_name_pre;
  balanced_doshas_pre: string = environment.message_balanced_doshas_pre;
  vata: string = environment.vata;
  pitta: string = environment.pitta;
  kapha: string = environment.kapha;

  message_create_eo_success: string = environment.message_create_eo_success;
  message_create_eo_error: string = environment.message_create_eo_error;
  message_update_eo_success: string = environment.message_update_eo_success;
  message_update_eo_error: string = environment.message_update_eo_error;

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
    this.essentialoilForm.form.patchValue({ "pitta": existingEssentialoil.balancedDoshas.pitta });
    this.essentialoilForm.form.patchValue({ "kapha": existingEssentialoil.balancedDoshas.kapha });
    this.essentialoilForm.form.patchValue({ "modernName": existingEssentialoil.modernName });
    this.essentialoilForm.form.patchValue({ "latinName": existingEssentialoil.latinName });
  }

  constructor(private _essentialoilDataService: EssentialoilDataService, private _activatedRoute: ActivatedRoute) { };

  @ViewChild("essentialoilForm")
  essentialoilForm!: NgForm;


  submitForm() {
    console.log("form values", this.essentialoilForm.value)
    if (this.existingEssentialoil) {
      this.updateEssentialoil();
    }
    else {
      this.createEssentialoil();
    }
  }

  updateEssentialoil() {
    console.log("updating essengion oil")
    const balancedDoshas = this.getBalancedDoshasFromForm();
    console.log("Balanced doshas to update", balancedDoshas)
    const newEssentialoil: Essentialoil = new Essentialoil(this.existingEssentialoil._id, this.essentialoilForm.form.value.modernName, this.essentialoilForm.form.value.latinName, balancedDoshas, this.existingEssentialoil.chemicals);
    const changedAttributes = this.identifyChanges(newEssentialoil);
    if (Object.keys(changedAttributes).length !== 0) {
      console.log("Updating essential oil", changedAttributes);
      this._essentialoilDataService.partialUpdateEssentialoil(this.existingEssentialoil._id, changedAttributes).subscribe({
        next: (savedEssentialoil) => { console.log("saved eo", savedEssentialoil); this.successfulUpdate = true; this.errorUpdating = false },
        error: (err) => { console.log("There was an error updating", err); this.successfulUpdate = false; this.errorUpdating = true; }
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

  getBalancedDoshasFromForm(): Doshas {
    console.log("vata", this.essentialoilForm.form.value.vata)
    return new Doshas(this.essentialoilForm.form.value.vata === true, this.essentialoilForm.form.value.pitta === true, this.essentialoilForm.form.value.kapha === true);
  }

  createEssentialoil() {
    console.log("vata", this.essentialoilForm.form.value.vata)
    const balancedDoshas: Doshas = this.getBalancedDoshasFromForm();
    const newEssentialoil: Essentialoil = new Essentialoil("", this.essentialoilForm.form.value.modernName, this.essentialoilForm.form.value.latinName, balancedDoshas, []);
    console.log("Creating essential oil", newEssentialoil);
    this._essentialoilDataService.createEssentialoil(newEssentialoil).subscribe({
      next: () => { this.successfulCreate = true; this.errorCreating = false; },
      error: () => { this.successfulCreate = false; this.errorCreating = true; }
    });
  }

}
