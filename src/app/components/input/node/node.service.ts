import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  public node: any[];

  constructor() {
    this.clear();
  }

  public clear(): void {
    this.node = new Array();
  }

  public getNodeColumns(index: number): any {
    let result: any = null;
    for (const tmp of this.node) {
      if (tmp.id.toString() === index.toString()) {
        result = tmp;
        break;
      }
    }
    // 対象データが無かった時に処理
    if (result == null) {
      result = { id: index, x: '', y: '', surface: '' };
      this.node.push(result);
    }
    return result;
  }

  // ファイルを読み込む
  public setNodeJson(jsonData: any): void {
    if (!('node' in jsonData)) {
      return;
    }
    const json: any = jsonData['node'];
    for (const index of Object.keys(json)) {
      const item = this.convertNumber(json[index]);
      const result = {
        id: index,
        x: item.x === null ? '' : item.x.toFixed(3),
        y: item.y === null ? '' : item.y.toFixed(3),
        surface: item.surface,
      };
      this.node.push(result);
    }
  }

  private convertNumber(item: any): any {
    const x: number = this.toNumber(item['x']);
    const y: number = this.toNumber(item['y']);
    const z: number = this.toNumber(item['z']);
    const surface: boolean = item['surface'];
    return {
      x,
      y,
      z,
      surface,
    };
  }

  public getNodeJson(empty: number = null): object {
    const jsonData: object = {};

    for (const row of this.node) {
      const item = this.convertNumber(row);
      if (item.x == null && item.y == null) {
        continue;
      }

      const key: string = row.id;
      jsonData[key] = {
        id: this.toNumber(key),
        x: item.x == null ? empty : item.x,
        y: item.y == null ? empty : item.y,
        surface: item.surface,
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
