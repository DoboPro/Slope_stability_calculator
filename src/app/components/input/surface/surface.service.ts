import { Injectable } from '@angular/core';
import { DataHelperModule } from '../../../providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class SurfaceService {

  public surface!: any[];

  constructor(private helper: DataHelperModule) {
    this.clear();
  }

  public clear(): void {
    this.surface = new Array();
  }

  public getSurfaceColums(index: number): any {
    let result: any = null;
    for (const tmp of this.surface) {
      if (tmp.id.toString() === index.toString()) {
        result = tmp;
        break;
      }
    }
    // 対象データが無かった時に処理
    if (result == null) {
      result = { x: '', y: '' };
      this.surface.push(result);
    }
    return result;
  }


  // ファイルを読み込む
  public setSurfaceJson(jsonData:any):void{
    if (!('surface' in jsonData)) {
      return;
    }
    const json: any = jsonData['surface'];
    for (const index of Object.keys(json)) {
      const item = this.convertNumber(json[index]);
      const result = {
        x: (item.x === null) ? '' : item.x.toFixed(3),
        y: (item.y === null) ? '' : item.y.toFixed(3)
      };
      this.surface.push(result);
    }
  }

  private convertNumber(item: any): any {
    const x: number = this.helper.toNumber(item['x']);
    const y: number = this.helper.toNumber(item['y']);
    return {
      x,
      y
    };
  }
}
