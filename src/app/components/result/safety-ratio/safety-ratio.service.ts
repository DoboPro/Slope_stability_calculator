import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SafetyRatioService {
  minX:number;
  minY:number;
  minR:number;
  reNode = [];

  constructor() { }

  public result(minX,minY,minR,reNode){
    this.minX = minX;
    this.minY = minY;
    this.minR = minR;
    this.reNode = reNode;
  }
}
