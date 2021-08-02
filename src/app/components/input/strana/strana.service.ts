import { Injectable } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class StranaService {

  public soil!: any[];
  public strana!: any[];
  strana_tmp: any;

  constructor(private helper: DataHelperModule) {
    this.clear();
  }

  public clear(): void {
    this.soil = new Array();
    this.strana = new Array();
  }

  public getSoilColumns(index: number): any {
    const caseNo: string = index.toString();

    let result = this.soil.find((tmp) => {
      return tmp.id === caseNo;
    });

    if (result === undefined) {
      result = {
        id: caseNo,
        name: "",
        v_weight: "",
        viscosity: "",
        w_viscosity: "",
        friction: "",
        w_friction: ""
      };
      this.soil.push(result);
    }
    return result;
  }

  public getStranaColumns(index: number, row: number) {
    const typNo: number = index;

    let target: any;
    let result: any = undefined;

    // タイプ番号を探す
    if (!this.strana[typNo]) {
      target = new Array();
    } else {
      target = this.strana[typNo];
    }

    // 行を探す
    result = target.find((tmp: any) => {
      return tmp.row === row;
    });

    // 対象行が無かった時に処理
    if (result === undefined) {
      result = {
        row: row,
        x: "",
        y: "",
      };
      target.push(result);
      this.strana[typNo] = target;
    }
    return result;
  }


  public setStranaJson(jsonData: any): void {
    if (!("load" in jsonData)) {
      return;
    }

    this.clear();

    const json: any = jsonData["load"];

    for (const index of Object.keys(json)) {
      this.strana_tmp = {};

      const item1: any = json[index];

      const _name: string = "name" in item1 ? item1["name"] : "";
      const _v_weight: string = "v_weight" in item1 ? item1["v_weight"] : "";
      const _viscosity: string =
        "viscosity" in item1 ? item1["viscosity"] : "";
      const _w_viscosity: string = "w_viscosity" in item1 ? item1["w_viscosity"] : "";
      const _friction: string = "friction" in item1 ? item1["friction"] : "";
      const _w_friction: string = "friction" in item1 ? item1["friction"] : "";

      this.soil.push({
        id: index,
        name: _name,
        v_weight: _v_weight,
        viscosity: _viscosity,
        w_viscosity: _w_viscosity,
        friction: _friction,
        _w_friction: _w_friction
      });


      const strana: any[] = item1["starana"];
      for (let i = 0; i < strana.length; i++) {
        const item2 = strana[i];

        const _row: string = "row" in item2 ? item2["row"] : i + 1;

        const _n: string = "n" in item2 ? item2.n : "";
        let _x: string = "";
        if ("x" in item2) _x = item2.x;
        let _y: string = "";
        if ("y" in item2) _y = item2.y;

        this.strana_tmp.push({
          row: _row,
          n: _n,
          x: _x,
          y: _y,
        });
      }
    }
    this.strana.push(this.strana_tmp)

    
    // this.strana[index] = strana_load;
  }
}

  // private convertNumber(item: any): any {
  //   const x: number = this.helper.toNumber(item['x']);
  //   const y: number = this.helper.toNumber(item['y']);
  //   return {
  //     x,
  //     y
  //   };
  // }

