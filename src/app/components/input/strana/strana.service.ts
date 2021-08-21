import { templateJitUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { rawListeners } from 'process';
import { SceneService } from '../../three/scene.service';


@Injectable({
  providedIn: 'root'
})
export class StranaService {

  public soil: any[];
  public strana: {};
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
        nodeNum: "",


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
    const result = {}

    const soil = this.getSoilJson(empty);

    const organization = this.getOrganizationJson(empty);

    for (const soil_id of Object.keys(organization)) {
      let jsonData = {};
      if (soil_id in soil) {
        jsonData = soil[soil_id];
      } else {
        jsonData = { gammna: 18, cohesion: 10, fai:30 };
      }
      jsonData["organization"] = organization[soil_id];
      // if (soil_id in organization) {
      //   jsonData["organization"] = load_member[load_id];
      //   delete load_member[load_id];
      // }
      result[soil_id] = jsonData;
    }
    return result;
  }

  //　土質情報
  public getSoilJson(empty: number = null, targetCase: string = ""): any {
    const soil = {}

    for (let i = 0; i < this.soil.length; i++) {
      const tmp = this.soil[i];
      const key: string = tmp["id"];

      //ケースの指定がある場合、カレントケース以外は無視する
      if (targetCase.length > 0 && key !== targetCase) {
        continue;
      }

      const id = this.toNumber(key);
      if (id == null) {
        continue;
      }

      const name: string = tmp["name"];
      const gamma = this.toNumber(tmp["gamma"]);
      const cohesion = this.toNumber(tmp["cohesion"]);
      const fai = this.toNumber(tmp["fai"]);


      if (
        name === "" &&
        gamma == null &&
        cohesion == null &&
        fai == null
      ) {
        continue;
      }

      const soil_id = (i + 1).toString();

      const temp = {
        gamma: gamma == null ? empty : gamma,
        cohesion: cohesion == null ? empty : cohesion,
        fai: fai == null ? empty : fai
      }

      if (empty == null) {
        tmp["name"] = name;
      }

      soil[soil_id] = temp;

    }
    return soil;
  }

  public getOrganizationJson(empty: number = null, targetCase: string = ""): any {
    const organization = {};

    for (const soil_id of Object.keys(this.strana)) {
      //　ケースの指定がある場合、カレントケース以外は無視する
      if (targetCase.length > 0 && soil_id !== targetCase) {
        continue;
      }

      const strana1: any[] = this.strana[soil_id];
      if (strana1.length === 0) {
        continue;
      }

      const tmp_organization = new Array();
      if (empty === null) {
        for (let j = 0; j < strana1.length; j++) {
          const row = strana1[j];
          const nodeNum = this.toNumber(row["nodeNum"]);
          if (nodeNum != null) {
            const tmp = {
              nodeNum: row.nodeNum
            };

            tmp["row"] = row.row;

            tmp_organization.push(tmp);
          }
        }
      } else {
        //　計算用データの作成

        const strana2: any[] = strana1;

        for (let j = 0; j < strana2.length; j++) {
          const row = strana2[j];

          const tmp = {
            nodeNum: row["nodeNum"]
          };

          tmp["row"] = row.row;

          tmp_organization.push(tmp);
        }
      }
      if (tmp_organization.length > 0) {
        organization[soil_id] = tmp_organization;
      }
    }
    return organization;

  }

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



  // private convertNumber(item: any): any {
  //   const x: number = this.helper.toNumber(item['x']);
  //   const y: number = this.helper.toNumber(item['y']);
  //   return {
  //     x,
  //     y
  //   };
  // }

