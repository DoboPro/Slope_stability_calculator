import { Injectable } from '@angular/core';
import { NodeService } from '../components/input/node/node.service';
import { StranaService } from '../components/input/strana/strana.service';
import { WaterlevelService } from '../components/input/waterlevel/waterlevel.service';
import { LoadService } from '../components/input/load/load.service';
import { InitialConditionService } from '../components/input/initial-condition/initial-condition.service';

@Injectable({
  providedIn: 'root',
})
export class InputDataService {
  constructor(
    public node: NodeService,
    public strana: StranaService,
    public waterlevel: WaterlevelService,
    public load: LoadService,
    public initialCondition: InitialConditionService
  ) {
    this.clear();
  }

  public clear(): void {
    this.node.clear();
    this.strana.clear();
    this.waterlevel.clear();
    this.load.clear();
    this.initialCondition.clear();
  }

  public loadInputData(inputText: string): void {
    this.clear();
    const jsonData: {} = JSON.parse(inputText);
    this.node.setNodeJson(jsonData);
    // this.strana.setStranaJson(jsonData);
    this.waterlevel.setWaterlevelJson(jsonData);
    this.load.setLoadJson(jsonData);
    this.initialCondition.setInitialConditionJson(jsonData);
  }

  // ファイルに保存用データを生成
  // empty = null: ファイル保存時
  // empty = 0: 計算時
  public getInputJson(empty: number = null): object {

    const jsonData = {};

    const node: {} = this.node.getNodeJson(empty);
    if (Object.keys(node).length > 0) {
      jsonData['node'] = node;
    } else if(empty === 0){
      jsonData['node'] = {};
    }


    return jsonData;
  }

  // ファイル名から拡張子を取得する関数
  public getExt(filename: string): string {
    const pos = filename.lastIndexOf('.');
    if (pos === -1) {
      return '';
    }
    const ext = filename.slice(pos + 1);
    return ext.toLowerCase();
  }
}
