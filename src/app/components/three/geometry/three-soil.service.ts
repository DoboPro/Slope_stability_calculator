import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SceneService } from '../scene.service';

@Injectable({
  providedIn: 'root'
})
export class ThreeSoilService {
  // 全ケースの地層情報を保存
  public AllStranaList: {};
  public currentIndex: string;
  private currentIndex_child1: string;
  private currentIndex_child2: string;

  constructor(
    //private strana: ThreeStranaService,
    private scene: SceneService,) { 

      this.AllStranaList = {};
    }

  // 表示ケースを変更する
  public changeCase(changeCase: number): void {
    const id: string = changeCase.toString();

    if (this.currentIndex === id) {
      // 同じなら何もしない
      return;
    }

    if (changeCase < 1) {
      // 非表示にして終わる
      for (const key of Object.keys(this.AllStranaList)) {
        const targetLoad = this.AllStranaList[key];
        const ThreeObject: THREE.Object3D = targetLoad.ThreeObject;
        //ThreeObject.visible = false;
      }
      this.scene.render();
      this.currentIndex = id;
      //this.strana.shareIndex(changeCase);
      return;
    }

    // 初めての荷重ケースが呼び出された場合
    if (!(id in this.AllStranaList)) {
      this.addCase(id);
    }

    // 荷重の表示非表示を切り替える
    for (const key of Object.keys(this.AllStranaList)) {
      const targetLoad = this.AllStranaList[key];
      const ThreeObject: THREE.Object3D = targetLoad.ThreeObject;
      //ThreeObject.visible = key === id ? true : false;
    }

    // カレントデータをセット
    this.currentIndex = id;
    //this.strana.shareIndex(changeCase);

    this.scene.render();
  }

  // ケースを追加する
  private addCase(id: string): void {
    const ThreeObject = new THREE.Object3D();
    ThreeObject.name = id;
    //ThreeObject.visible = false; // ファイルを読んだ時点では、全ケース非表示
    this.AllStranaList[id] = {
      ThreeObject,
      //pointLoadList: {},
      //memberLoadList: {},
      varticeList: [], // 通過する点のlist
    };

    this.scene.add(ThreeObject); // シーンに追加
  }
  
  // three.service から呼ばれる 表示・非表示の制御
  public visibleChange(flag: boolean, gui: boolean): void {

    /* // 非表示にする
    if (flag === false) {
      this.guiDisable();
      this.changeCase(-1);
      this.isVisible.object = false;
      return;
    }

    // gui の表示を切り替える
    if (gui === true) {
      this.guiEnable();
      //console.log('荷重強度の入力です。')
    } else {
      // 黒に戻す
      this.guiDisable();
      // setColor を初期化する
      //console.log('荷重名称の入力です。')
      this.selectChange(-1, 0);
    }
    this.isVisible.gui = gui; */

    // すでに表示されていたら変わらない
    //if (this.isVisible.object === true) {
      //return;
    //}

    // 表示する
    this.changeCase(1);
    //this.isVisible.object = true;
  }

  public getAllStranaList(){

  }
}
