import { Injectable } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class InitialConditionService {
  public initialCondition!: any[];

  constructor(private helper: DataHelperModule) {
    this.clear();
  }

  public clear(): void {
    this.initialCondition = new Array();
  }

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
      result = { seismic: '', 
                  dWidth: '', 
                  floatP: '', 
                waterDif: '', 
                calcShow: '',
                      x0: '', 
                      y0: '', 
                      r0: '' };
      this.initialCondition.push(result);
    }
    return result;
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
        seismic: (item.seismic === null) ? '' : item.seismic.toFixed(3),
        dWidth:   (item.dWidth === null) ? '' : item.dWidth.toFixed(0),
        floatP:   (item.floatP === null) ? '' : item.dWidth.toFixed(3),
        waterDif: (item.waterDif === null) ? '' : item.waterDif.toFixed(3),
        calcShow: (item.calcShow === null) ? '' : item.calcShow.toFixed(0),
        x0:        (item.x0 === null) ? '' : item.x0.toFixed(0),
        y0:       (item.y0 === null) ? '' : item.y0.toFixed(0),
        r0:       (item.r0 === null) ? '' : item.r0.toFixed(0),
      };
      this.initialCondition.push(result);
    }
  }

  private convertNumber(item: any): any {
    const seismic:  number = this.helper.toNumber(item['seismic ']);
    const dWidth:   number = this.helper.toNumber(item['dWidth  ']);
    const floatP:   number = this.helper.toNumber(item['floatP  ']);
    const waterDif: number = this.helper.toNumber(item['waterDif']);
    const calcShow: number = this.helper.toNumber(item['calcShow']);
    const x0:       number = this.helper.toNumber(item['x0      ']);
    const y0:       number = this.helper.toNumber(item['y0      ']);
    const r0:       number = this.helper.toNumber(item['r0      ']);
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
}