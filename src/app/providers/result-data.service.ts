import { Injectable } from '@angular/core';
import { ThreeResultService } from '../components/three/geometry/three-result.service';

@Injectable({
  providedIn: 'root'
})
export class ResultDataService {

  constructor(
    private result: ThreeResultService,
  ) { }

  // 計算結果を読み込む
  public loadResultData(minX: number, minY: number, minR: number, reNode: any): void {

    const minCircle = {x: minX, y: minY, r: minR};
    const minCircleNode = reNode

    // 計算結果の描画
    this.result.setResultData(minCircle, minCircleNode);
  }
}
