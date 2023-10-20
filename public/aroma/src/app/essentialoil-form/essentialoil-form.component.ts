import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Essentialoil } from '../essentialoil.service';
import { EssentialoilDataService } from '../essentialoil-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-essentialoil-form',
  templateUrl: './essentialoil-form.component.html',
  styleUrls: ['./essentialoil-form.component.css']
})
export class EssentialoilFormComponent implements OnInit {

  // existingEssentialoil!: Essentialoil;

  ngOnInit(): void {
    // setTimeout(() => {this.thingy.form.setValue({modernName: "hi", latinName: "bye", balancedDoshas: true})}, 0);
    if(this._activatedRoute.snapshot.params['essentialoilId']){
      this._essentialoilDataService.getOneEssentialoil(this._activatedRoute.snapshot.params['essentialoilId']).subscribe({
        next: (foundEssentialOil) => this._initializeFormFromExistingEssentialoil(foundEssentialOil),
        error: (err) => {console.log("Error with essential oil data service while calling get one", err)}
      });
    }
    
  }

  _initializeFormFromExistingEssentialoil(existingEssentialoil: Essentialoil): void{
    if(existingEssentialoil.balancedDoshas.includes("Vata")){
      this.essentialoilForm.form.patchValue({"vata": true});
    }
    if(existingEssentialoil.balancedDoshas.includes("Pitta")){
      this.essentialoilForm.form.patchValue({"pitta": true});
    }
    if(existingEssentialoil.balancedDoshas.includes("Kapha")){
      this.essentialoilForm.form.patchValue({"kapha": true});
    }
    this.essentialoilForm.form.patchValue({"modernName": existingEssentialoil.modernName});
    this.essentialoilForm.form.patchValue({"latinName": existingEssentialoil.latinName});
  }

  constructor(private _essentialoilDataService: EssentialoilDataService, private _activatedRoute: ActivatedRoute){};

  @ViewChild("essentialoilForm")
  essentialoilForm!: NgForm;

  createEssentialoil(){
    // console.log(this.thingy.form.value);
    const balancedDoshas: string[] = new Array();
    if(this.essentialoilForm.form.value.vata){
      balancedDoshas.push("Vata");
    }
    if(this.essentialoilForm.form.value.pitta){
      balancedDoshas.push("Pitta");
    }
    if(this.essentialoilForm.form.value.kapha){
      balancedDoshas.push("Kapha");
    }
    const newEssentialoil: Essentialoil = new Essentialoil("", this.essentialoilForm.form.value.modernName, this.essentialoilForm.form.value.latinName, balancedDoshas, []);
    this._essentialoilDataService.createEssentialoil(newEssentialoil);
  }

}
