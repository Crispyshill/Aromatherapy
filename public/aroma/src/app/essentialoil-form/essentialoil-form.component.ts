import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Essentialoil } from '../essentialoil.service';
import { EssentialoilDataService } from '../essentialoil-data.service';

@Component({
  selector: 'app-essentialoil-form',
  templateUrl: './essentialoil-form.component.html',
  styleUrls: ['./essentialoil-form.component.css']
})
export class EssentialoilFormComponent implements OnInit {
  ngOnInit(): void {
    // setTimeout(() => {this.thingy.form.setValue({modernName: "hi", latinName: "bye", balancedDoshas: true})}, 0);
    
  }

  constructor(private _essentialoilDataService: EssentialoilDataService){};

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
