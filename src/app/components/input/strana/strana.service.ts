import { templateJitUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { SceneService } from '../../three/scene.service';


@Injectable({
  providedIn: 'root'
})
export class StranaService {

  public soil: any[];
  public strana: any[];
  strana_tmp: any;

  

  constructor(
  ) {
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
        nodeNum : "",


      };
      target.push(result);
      this.strana[typNo] = target;
    }
    return result;
  }


  // public setStranaJson(jsonData: any): void {
  //   if (!("load" in jsonData)) {
  //     return;
  //   }

  //   this.clear();

  //   const json: any = jsonData["load"];

  //   for (const index of Object.keys(json)) {
  //     this.strana_tmp = {};

  //     const item1: any = json[index];

  //     const _name: string = "name" in item1 ? item1["name"] : "";
  //     const _v_weight: string = "v_weight" in item1 ? item1["v_weight"] : "";
  //     const _viscosity: string =
  //       "viscosity" in item1 ? item1["viscosity"] : "";
  //     const _w_viscosity: string = "w_viscosity" in item1 ? item1["w_viscosity"] : "";
  //     const _friction: string = "friction" in item1 ? item1["friction"] : "";
  //     const _w_friction: string = "friction" in item1 ? item1["friction"] : "";

  //     this.soil.push({
  //       id: index,
  //       name: _name,
  //       v_weight: _v_weight,
  //       viscosity: _viscosity,
  //       w_viscosity: _w_viscosity,
  //       friction: _friction,
  //       _w_friction: _w_friction
  //     });


  //     const strana: any[] = item1["starana"];
  //     for (let i = 0; i < strana.length; i++) {
  //       const item2 = strana[i];

  //       const _row: string = "row" in item2 ? item2["row"] : i + 1;

  //       const _n: string = "n" in item2 ? item2.n : "";
  //       let _x: string = "";
  //       if ("x" in item2) _x = item2.x;
  //       let _y: string = "";
  //       if ("y" in item2) _y = item2.y;

  //       this.strana_tmp.push({
  //         row: _row,
  //         n: _n,
  //         x: _x,
  //         y: _y,
  //       });
  //     }
  //   }
  //   this.strana.push(this.strana_tmp)

    
  //   // this.strana[index] = strana_load;
  // }

  public getStranaJson(empty: number = null, targetCase: string = "") {
    const strana = {}

    for (const id of Object.keys(this.strana)) {
      // ケースの指定がある場合、カレントケース以外は無視する
      if (targetCase.length > 0 && id !== targetCase) {
        continue;
      }

      /* const load1: any[] = this.load[load_id];
      if (load1.length === 0) {
        continue;
      } */

      const tmp_strana = new Array();
      const target = this.strana[id];
      for (const key of Object.keys(target)){
        const item = target[key];
        const row = item.row;
        const nodeNum = item.nodeNum;

        const tmp = {
          row: row,
          nodeNum : nodeNum,
        }

        tmp_strana[key] = tmp;
      }

      strana[id] = tmp_strana;
      /* if (empty === null) {
        for (let j = 0; j < load1.length; j++) {
          const row = load1[j];
          const m1 = this.helper.toNumber(row["m1"]);
          const m2 = this.helper.toNumber(row["m2"]);
          const direction: string = row["direction"];
          const mark = this.helper.toNumber(row["mark"]);
          const L1 = this.helper.toNumber(row["L1"]);
          const L2 = this.helper.toNumber(row["L2"]);
          const P1 = this.helper.toNumber(row["P1"]);
          const P2 = this.helper.toNumber(row["P2"]);

          if (
            (m1 != null || m2 != null) &&
            mark != null && //&& direction != ''
            (L1 != null || L2 != null || P1 != null || P2 != null)
          ) {
            const tmp = {
              m1: row.m1,
              m2: row.m2,
              direction: row.direction,
              mark: row.mark,
              L1: row.L1,
              L2: row.L2,
              P1: P1,
              P2: P2,
            };

            tmp["row"] = row.row;

            tmp_member.push(tmp);
          }
        }
      } else {
        // 計算用のデータ作成

        const load2: any[] = this.convertMemberLoads(load1);

        for (let j = 0; j < load2.length; j++) {
          const row = load2[j];

          const tmp = {
            m: row["m1"],
            direction: row["direction"],
            mark: row["mark"],
            L1: this.helper.toNumber(row["L1"], 3),
            L2: this.helper.toNumber(row["L2"], 3),
            P1: this.helper.toNumber(row["P1"], 2),
            P2: this.helper.toNumber(row["P2"], 2),
          };

          tmp["row"] = row.row;

          tmp_member.push(tmp);
        }
      }
      if (tmp_member.length > 0) {
        load_member[load_id] = tmp_member;
      }*/
    } 
    return strana;
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

