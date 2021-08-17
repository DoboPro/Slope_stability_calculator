import { NgModule } from "@angular/core";
import { NodeService } from "../components/input/node/node.service";

@NgModule({
  imports: [],
  exports: [],
})

export class DataHelperModule {

  constructor(private node:NodeService) {

  }
  // 文字列string を数値にする
  public toNumber(num: string, digit: number = null): number {
    let result : any;
    try {
      const tmp: string = num.toString().trim();
      if (tmp.length > 0) {
        result = ((n: number) => (isNaN(n) ? null : n))(+tmp);
      }
    } catch {
      result = null;
    }
    if (digit != null) {
      const dig: number = 10 ** digit;
      result = Math.round(result * dig) / dig;
    }
    return result;
  }

  

}
