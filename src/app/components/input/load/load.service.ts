import { Injectable } from '@angular/core';
// import { DataHelperModule } from 'src/app/providers/data-helper.module';

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  public load: any[];

  constructor() {
    this.clear();
  }

  public clear(): void {
    this.load = new Array();
  }

  public getLoadColumns(index: number): any {
    let result: any = null;
    for (const tmp of this.load) {
      if (tmp.id.toString() === index.toString()) {
        result = tmp;
        break;
      }
    }
    // 対象データが無かった時に処理
    if (result == null) {
      result = { id: index, x_s: '',x_d: '', loadAmount: '' };
      this.load.push(result);
    }
    return result;
  }

  // ファイルを読み込む
  public setLoadJson(jsonData: any): void {
    if (!('load' in jsonData)) {
      return;
    }
    const json: any = jsonData['load'];
    for (const index of Object.keys(json)) {
      const item = this.convertNumber(json[index]);
      const result = {
        id: index,
        x_s: item.x_s === null ? '' : item.x_s.toFixed(3),
        x_d: item.x_d === null ? '' : item.x_d.toFixed(3),
        loadAmount: item.loadAmount === null ? '' : item.loadAmount.toFixed(3),
      };
      this.load.push(result);
    }
  }

  private convertNumber(item: any): any {
    const x_s: number = this.toNumber(item['x_s']);
    const x_d: number = this.toNumber(item['x_d']);
    const loadAmount: number = this.toNumber(item['loadAmount']);
    return {
      x_s,
      x_d,
      loadAmount,
    };
  }

  public getloadJson(empty: number = null): object {
    const jsonData: object = {};

    for (const row of this.load) {
      const item = this.convertNumber(row);
      if (item.x_s == null && item.x_d == null && item.loadAmount == null) {
        continue;
      }

      const key: string = row.id;
      jsonData[key] = {
        x_s: item.x_s == null ? empty : item.x_s,
        x_d: item.x_d == null ? empty : item.x_d,
        loadAmount: item.loadAmount == null ? empty : item.loadAmount
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
