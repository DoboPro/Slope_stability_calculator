import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SurfaceService {

  public surface: any[];

  constructor() {
    this.clear();
  }

  public clear(): void {
    this.surface = new Array();
  }

  public getSurfaceColumns(index: number): any {
    let result: any = null;
    for (const tmp of this.surface) {
      if (tmp.id.toString() === index.toString()) {
        result = tmp;
        break;
      }
    }
    // 対象データが無かった時に処理
    if (result == null) {
      result = { id: index, x: '', y: '' };
      this.surface.push(result);
    }
    return result;
  }


  // ファイルを読み込む
  public setSurfaceJson(jsonData: any): void {
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
    const x: number = this.toNumber(item['x']);
    const y: number = this.toNumber(item['y']);
    return {
      x,
      y
    };
  }

  // 文字列string を数値にする
  public toNumber(num: string): number {
    let result: any;
    try {
      const tmp: string = num.toString().trim();
      if (tmp.length > 0) {
        result = ((n: number) => (isNaN(n) ? null : n))(+tmp);
      }
    } catch {
      result = null;
    }
    // if (digit != null) {
    //   const dig: number = 10 ** digit;
    //   result = Math.round(result * dig) / dig;
    // }
    return result;
  }
}
