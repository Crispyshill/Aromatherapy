import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Essentialoil } from '../essentialoil.service';
import { EssentialoilDataService } from '../essentialoil-data.service';

@Component({
  selector: 'app-essentialoil',
  templateUrl: './essentialoil.component.html',
  styleUrls: ['./essentialoil.component.css']
})
export class EssentialoilComponent implements OnInit{

  essentialoil!: Essentialoil;

  constructor(private _activatedRoute: ActivatedRoute, private _essentialoilData: EssentialoilDataService ){}

  ngOnInit(): void {
    this._essentialoilData.getOneEssentialoil(this._activatedRoute.snapshot.params['essentialoilId']).subscribe({
      next: (essentialoil) => {this.essentialoil = essentialoil},
      error: (err) => {console.log("Error in essential oil data service", err)},
      complete: () => {}
    })
  }





}
