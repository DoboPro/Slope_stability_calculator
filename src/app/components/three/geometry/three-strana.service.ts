import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { NodeService } from '../../input/node/node.service';
import { StranaService } from '../../input/strana/strana.service';
import { SceneService } from '../scene.service';
import { ThreeSoilService } from './three-soil.service';

@Injectable({
  providedIn: 'root'
})
export class ThreeStranaService {
  // 全ケースの地層情報を保存
  private AllStranaList: {};
  private currentIndex: string;
  private currentIndex_child1: string;
  private currentIndex_child2: string;

  constructor(
    private node: NodeService,
    private soil: ThreeSoilService,
    private strana: StranaService,
    private scene: SceneService,) { 

      this.AllStranaList = this.soil.AllStranaList;
    }

  // 表示ケースを変更する
  public changeData(row: number): void {

    // soilとcurrentIndexを共有する
    this.currentIndex = this.soil.currentIndex;

    const nodeData = this.node.getNodeJson(0);
    if (Object.keys(nodeData).length <= 0){
      return;
    }

    const stranaData = this.strana.getStranaJson(0, this.currentIndex);
    this.changeStrana(row, stranaData[this.currentIndex], nodeData)

    this.scene.render();

    return;
    const id: string = row.toString();

    if (this.currentIndex === id) {
      // 同じなら何もしない
      return;
    }

    if (row < 1) {
      // 非表示にして終わる
      for (const key of Object.keys(this.AllStranaList)) {
        const targetLoad = this.AllStranaList[key];
        const ThreeObject: THREE.Object3D = targetLoad.ThreeObject;
        ThreeObject.visible = false;
      }
      this.scene.render();
      this.currentIndex = id;
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
      ThreeObject.visible = key === id ? true : false;
    }

    // カレントデータをセット
    this.currentIndex = id;

    this.scene.render();
  }

  // ケースを追加する
  private addCase(id: string): void {
    const ThreeObject = new THREE.Object3D();
    ThreeObject.name = id;
    ThreeObject.visible = false; // ファイルを読んだ時点では、全ケース非表示
    this.AllStranaList[id] = {
      ThreeObject,
      pointLoadList: {},
      memberLoadList: {},
      pMax: 0, // 最も大きい集中荷重値
      mMax: 0, // 最も大きいモーメント
      wMax: 0, // 最も大きい分布荷重
      rMax: 0, // 最も大きいねじり分布荷重
      qMax: 0  // 最も大きい軸方向分布荷重
    };

    this.scene.add(ThreeObject); // シーンに追加
  }

  private changeStrana(row, stranaData, nodeData){
    
    const ThreeObject = this.AllStranaList[this.currentIndex].ThreeObject;
    if (ThreeObject.children.length >= 1) {
      while (ThreeObject.children.length > 0) {
        const object = ThreeObject.children[0];
        object.parent.remove(object);
      }
    }

    const verticeList = [];
    for (const id of Object.keys(stranaData)) {
      const data = stranaData[id];
      if (data.nodeNum === '') {
        continue;
      }
      const node = data.nodeNum;
      const point = nodeData[node];
      if (point === undefined) {
        continue;
      }
      verticeList.push(point)
    }
    if (verticeList.length <= 2) return;
    this.create(verticeList, ThreeObject);
  }


  private create(vertice, ThreeObject) {
    const stranaShape = new THREE.Shape();

    //stranaShape.moveTo(vertice[0].x, vertice[0].y)
    stranaShape.moveTo(0, 0)
    for (let num = 1; num < vertice.length; num++) {
      //stranaShape.lineTo(vertice[num].x, vertice[num].y)
      stranaShape.lineTo(vertice[num].x - vertice[0].x, vertice[num].y - vertice[0].y)
    }

    const geometry = new THREE.ShapeGeometry( stranaShape );
    let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    if (this.currentIndex === '2') {
      material = new THREE.MeshBasicMaterial( { color: 0x00af30 } );
    } else if (this.currentIndex === '3') {
      material = new THREE.MeshBasicMaterial( { color: 0x006f60 } );
    } else if (this.currentIndex === '4') {
      material = new THREE.MeshBasicMaterial( { color: 0x003f90 } );
    } 

    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(vertice[0].x, vertice[0].y, 0)
    mesh["memo"] = {position : {x: vertice[0].x, y: vertice[0].y}}

    ThreeObject.add(mesh)

  }

  // ケースの荷重図を消去する
  public removeCase(id: string): void {
    if (!(id in this.AllStranaList)) {
      return;
    }

    const data = this.AllStranaList[id];
    //this.removeMemberLoadList(data);
    //this.removePointLoadList(data);

    const ThreeObject = data.ThreeObject;
    this.scene.remove(ThreeObject);

    delete this.AllStranaList[id];

    this.scene.render();
  }

}
