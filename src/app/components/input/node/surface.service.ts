import { Injectable } from '@angular/core';
import { ThreeStranaService } from '../../three/geometry/three-strana.service';

@Injectable({
  providedIn: 'root',
})
export class SurfaceService {
  // strana: any;

  constructor(private strana: ThreeStranaService) {}

  public getSurfaceJsons(node): object {
    const jsonData: object = {};
    const nodeData = node;
    const surSta = this.strana.min_x;
    const surEnd = this.strana.max_x;
    const surface = this.strana.groundLinear;

    for (let i = surSta; i < surEnd; i += 0.1) {
      let ii = Math.round(i * 10) / 10;
      let surface_x = surface[ii].x;
      let surface_y = surface[ii].y;
      if (node.findIndex((v) => v.x === surface_x && v.y === surface_y)) {
        console.log('AA');
      } else {
        console.log('D');
      }
    }

    const a = 1;

    // for (const row of this.node) {
    //   // const item = this.convertNumber(row);
    //   if (item.x == null && item.y == null) {
    //     continue;
    //   }

    //   const key: string = row.id;
    //   jsonData[key] = {
    //     x: item.x == null ? empty : item.x,
    //     y: item.y == null ? empty : item.y,
    //     surface: item.x == null && item.y == null ? empty : false,
    //   };
    // }
    return jsonData;
  }
}
