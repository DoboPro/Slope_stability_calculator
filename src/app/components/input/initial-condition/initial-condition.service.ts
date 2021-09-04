import { Injectable } from '@angular/core';
// import { DataHelperModule } from 'src/app/providers/data-helper.module';

@Injectable({
  providedIn: 'root',
})
export class InitialConditionService {
  public initialCondition!: any[];

  public floatP: number;

  public seimic = 0;
  public dWidth = 2;

  public waterDif = 0.1;
  // public diagonal: string[] = ['右上がり', '左上がり'];
  public diagonal: string = '右上がり';
  // public calcShow: string[] = ['表示する', '表示しない'];
  public calcShow: string = '表示する';
  public x0 = 16;
  public y0 = 16;
  public r0 = 13;

  constructor() {
    this.clear();
  }

  public clear(): void {
    this.initialCondition = new Array();
  }

  // public selectedFloat = '0';

  // public floatP_list = [
  //   { id: '0', name: '考慮する' },
  //   { id: '1', name: '間隙水圧' },
  // ];

  // public floatP = Number(this.selectedFloat);

  // public getInputArray(): number[] {
  //   const result = [
  //     this.seimic,
  //     this.dWidth,
  //     this.floatP,
  //     this.waterDif,
  //     this.diagonal,
  //     this.calcShow,
  //     this.x0,
  //     this.y0,
  //     this.r0,
  //   ];

  //   return result;
  // }

  public getInitialConditionColums(index: number): any {
    let result: any = null;
    for (const tmp of this.initialCondition) {
      if (tmp.id.toString() === index.toString()) {
        result = tmp;
        break;
      }
    }
    // 対象データが無かった時に処理
    if (result == null) {
      result = {
        seismic: '',
        dWidth: '',
        floatP: '',
        waterDif: '',
        diagonal: '',
        calcShow: '',
        x0: '',
        y0: '',
        r0: '',
      };
      this.initialCondition.push(result);
    }
    return result;
  }

  public getInitialConditionJson(empty: number = null) {
    let jsonData: object = {};
    jsonData = {
      seimic: this.seimic,
      dWidth: this.dWidth,
      floatP: this.floatP,
      waterDif: this.waterDif,
      diagonal: this.diagonal,
      calcShow: this.calcShow,
      x0: this.x0,
      y0: this.y0,
      r0: this.r0,
    };
    return jsonData;
  }

  // ファイルを読み込む
  public setInitialConditionJson(jsonData: any): void {
    if (!('initialCondition' in jsonData)) {
      return;
    }
    const json: any = jsonData['initialCondition'];
    for (const index of Object.keys(json)) {
      const item = this.convertNumber(json[index]);
      const result = {
        seismic: item.seismic === null ? '' : item.seismic.toFixed(3),
        dWidth: item.dWidth === null ? '' : item.dWidth.toFixed(0),
        floatP: item.floatP === null ? '' : item.dWidth.toFixed(3),
        waterDif: item.waterDif === null ? '' : item.waterDif.toFixed(3),
        calcShow: item.calcShow === null ? '' : item.calcShow.toFixed(0),
        x0: item.x0 === null ? '' : item.x0.toFixed(0),
        y0: item.y0 === null ? '' : item.y0.toFixed(0),
        r0: item.r0 === null ? '' : item.r0.toFixed(0),
      };
      this.initialCondition.push(result);
    }
  }

  private convertNumber(item: any): any {
    const seismic: number = this.toNumber(item['seismic ']);
    const dWidth: number = this.toNumber(item['dWidth  ']);
    const floatP: number = this.toNumber(item['floatP  ']);
    const waterDif: number = this.toNumber(item['waterDif']);
    const calcShow: number = this.toNumber(item['calcShow']);
    const x0: number = this.toNumber(item['x0      ']);
    const y0: number = this.toNumber(item['y0      ']);
    const r0: number = this.toNumber(item['r0      ']);
    return {
      seismic,
      dWidth,
      floatP,
      waterDif,
      calcShow,
      x0,
      y0,
      r0,
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
