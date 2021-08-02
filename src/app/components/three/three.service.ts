import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {

  constructor() { }

  public ClearData(): void {
    // for (const mesh of this.nodeList.children) {
    //   // 文字を削除する
    //   while (mesh.children.length > 0) {
    //     const object = mesh.children[0];
    //     object.parent.remove(object);
    //   }
    // }
    // // オブジェクトを削除する
    // this.nodeList.children= new Array();
    // // this.nodeList = new Array();
    // this.baseScale = 1;
    // this.maxDistance = 0;
    // this.minDistance = 0;
    // this.center = { x: 0, y: 0 };
  }
}
