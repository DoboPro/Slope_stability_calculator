import { Injectable } from '@angular/core';
import { ThreeStranaService } from '../../three/geometry/three-strana.service';

@Injectable({
  providedIn: 'root'
})
export class ThreedataService {

  ground = {}
  constructor(public strana:ThreeStranaService) {
    this.ground = this.strana.GroundLinear;
   }


  public receiveStrana(){
    return this.strana.GroundLinear;
  }
}
