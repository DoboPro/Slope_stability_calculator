import { Injectable } from '@angular/core';
// import { DataHelperModule } from 'src/app/providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class WaterlevelService {

  public waterlevel!: any[];

  constructor() {
    this.clear();
  }

  public clear(): void {
    this.waterlevel = new Array();
  }

  public getWaterlevelColums(index: number): any {
    let result: any = null;
    for (const tmp of this.waterlevel) {
      if (tmp.id.toString() === index.toString()) {
        result = tmp;
        break;
      }
    }
    // 対象データが無かった時に処理
    if (result == null) {
      result = { id: index, x: '', y: '' };
      this.waterlevel.push(result);
    }
    return result;
  }

  public getWaterLevelJson(empty: number = null ): object {

    const jsonData: object = {};

    for (const row of this.waterlevel) {

      const item = this.convertNumber(row);
      if (item.x == null && item.y == null) {
        continue;
      }

      const key: string = row.id;
      jsonData[key] = {
        x: (item.x == null) ? empty : item.x,
        y: (item.y == null) ? empty : item.y,
      };
    }
    return jsonData;
  }


  // ファイルを読み込む
  public setWaterlevelJson(jsonData: any): void {
    if (!('waterlevel' in jsonData)) {
      return;
    }
    const json: any = jsonData['waterlevel'];
    for (const index of Object.keys(json)) {
      const item = this.convertNumber(json[index]);
      const result = {
        x: (item.x === null) ? '' : item.x.toFixed(3),
        y: (item.y === null) ? '' : item.y.toFixed(3)
      };
      this.waterlevel.push(result);
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

  public getWaterlevelJson(empty: number = null ): object {

    const jsonData: object = {};

    for (const row of this.waterlevel) {

      const item = this.convertNumber(row);
      if (item.x == null && item.y == null) {
        continue;
      }

      const key: string = row.id;
      jsonData[key] = {
        x: (item.x == null) ? empty : item.x,
        y: (item.y == null) ? empty : item.y,
      };
    }
    return jsonData;
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
