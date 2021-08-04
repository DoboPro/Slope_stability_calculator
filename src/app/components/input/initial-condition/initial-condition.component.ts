import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ThreeService } from '../../three/three.service';
import { InitialConditionService } from './initial-condition.service';

@Component({
  selector: 'app-initial-condition',
  templateUrl: './initial-condition.component.html',
  styleUrls: ['./initial-condition.component.scss']
})
export class InitialConditionComponent implements OnInit {

  public seismic: number;
  public dWidth: number;
  public floatP: string[];
  public waterDif: number;
  public diagonal:string[];
  public calcShow: string[];
  public x0: number;
  public y0: number;
  public r0: number;


  private ROWS_COUNT = 15;
  public inner_width = 290;


  constructor(private data: InitialConditionService,
    private app: AppComponent,
    private three: ThreeService) { }

  ngOnInit(): void {
    this.seismic = this.data.seimic;
    this.dWidth = this.data.dWidth;
    this.floatP = this.data.floatP;
    this.waterDif = this.data.waterDif;
    this.diagonal = this.data.diagonal;
    this.calcShow = this.data.calcShow;
    this.x0 = this.data.x0;
    this.y0 = this.data.y0;
    this.r0 = this.data.r0;
  }

  ngOnDestroy() {
    this.data.seimic = this.seismic;
    this.data.dWidth = this.dWidth;
    this.data.floatP = this.floatP;
    this.data.waterDif = this.waterDif;
    this.data.diagonal = this.diagonal;
    this.data.calcShow = this.calcShow;
    this.data.x0 = this.x0;
    this.data.y0 = this.y0;
    this.data.r0 = this.r0;
  }

}
