import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { NodeService } from '../../input/node/node.service';
import { StranaService } from '../../input/strana/strana.service';
import { SceneService } from '../scene.service';
import { ThreeSoilService } from './three-soil.service';

@Injectable({
  providedIn: 'root',
})
export class ThreeStranaService {
  // 全ケースの地層情報を保存
  public AllStranaList: {};
  private currentIndex: string;
  private currentIndex_child1: string;
  private currentIndex_child2: string;

  private organizationList;

  public groundLinear: any;

  constructor(
    private node: NodeService,
    private soil: ThreeSoilService,
    private strana: StranaService,
    private scene: SceneService
  ) {
    this.AllStranaList = this.soil.AllStranaList;
  }

  // 表示ケースを変更する
  public changeData(row: number, index: string = this.soil.currentIndex): void {
    // soilとcurrentIndexを共有する。または、changeNodeから得る
    this.currentIndex = index;

    const nodeData = this.node.getNodeJson(0);
    if (Object.keys(nodeData).length <= 0) {
      return;
    }

    const stranaData = this.strana.getOrganizationJson(0, this.currentIndex);
    this.changeStrana(row, stranaData[this.currentIndex], nodeData);

    this.scene.render();

    return;
  }

  public resetData() {
    this.organizationList = this.strana.getOrganizationJson(0);
    for (let i = 1; i <= Object.keys(this.organizationList).length; i++) {
      this.currentIndex = i.toString();
      let row = Object.keys(this.organizationList[i]).length;
      this.soil.changeCase(i);
      for (let j = 1; j <= row; j++) {
        this.changeData(j, this.currentIndex);
      }
      // this.changeData()
    }
    // this.soil.currentIndexを1に戻すために実行
    this.soil.changeCase(1);
  }

  // ケースを追加する
  // private addCase(id: string): void {
  //   const ThreeObject = new THREE.Object3D();
  //   ThreeObject.name = id;
  //   ThreeObject.visible = false; // ファイルを読んだ時点では、全ケース非表示
  //   this.AllStranaList[id] = {
  //     ThreeObject,
  //     pointLoadList: {},
  //     memberLoadList: {},
  //     pMax: 0, // 最も大きい集中荷重値
  //     mMax: 0, // 最も大きいモーメント
  //     wMax: 0, // 最も大きい分布荷重
  //     rMax: 0, // 最も大きいねじり分布荷重
  //     qMax: 0  // 最も大きい軸方向分布荷重
  //   };

  //   this.scene.add(ThreeObject); // シーンに追加
  // }

  private changeStrana(row, stranaData, nodeData) {
    const ThreeObject = this.AllStranaList[this.currentIndex].ThreeObject;
    if (ThreeObject.children.length >= 1) {
      while (ThreeObject.children.length > 0) {
        const object = ThreeObject.children[0];
        object.parent.remove(object);
      }
    }
    this.AllStranaList[this.currentIndex].verticeList = [];

    if (stranaData === undefined) {
      return;
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
      verticeList.push(point);
    }
    if (verticeList.length <= 2) return;
    this.AllStranaList[this.currentIndex].verticeList = verticeList;

    this.create(verticeList, ThreeObject);

    // 地表面の座標を獲得する
//     this.groundLinear = this.getGroundLinear();
  
    this.getDetectedObjects();

  }

  private create(vertice, ThreeObject) {
    const stranaShape = new THREE.Shape();

    stranaShape.moveTo(0, 0);
    for (let num = 1; num < vertice.length; num++) {
      stranaShape.lineTo(
        vertice[num].x - vertice[0].x,
        vertice[num].y - vertice[0].y
      );
    }

    //const geometry = new THREE.ShapeGeometry(stranaShape);
    const extrudeSettings = {
      steps: 1,
      depth: 0.1,
      bevelEnabled: false,
    };
// <<<<<<< mizutani_#27_2
//     const geometry = new THREE.ExtrudeGeometry(stranaShape, extrudeSettings);
//     let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     if (this.currentIndex === '2') {
//       material = new THREE.MeshBasicMaterial({ color: 0x00af30 });
//     } else if (this.currentIndex === '3') {
//       material = new THREE.MeshBasicMaterial({ color: 0x006f60 });
//     } else if (this.currentIndex === '4') {
//       material = new THREE.MeshBasicMaterial({ color: 0x003f90 });
//     }
// =======
    const geometry = new THREE.ExtrudeGeometry( stranaShape, extrudeSettings );
    const material = new THREE.MeshBasicMaterial({ color: color });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(vertice[0].x, vertice[0].y, 0.0);
    mesh['memo'] = { position: { x: vertice[0].x, y: vertice[0].y } };

    ThreeObject.add(mesh);

    // ここで当たり判定を行う
    this.detectJudge(mesh, ThreeObject);

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

  // 節点の入力が変更された場合 新しい入力データを保持しておく
  public changeNode(jsonData): void {
    //this.newNodeData = jsonData;
    for (const targetID of Object.keys(this.AllStranaList)) {
      const target = this.AllStranaList[targetID];
      if (target.ThreeObject.children.length < 1) {
        continue;
      }
      this.changeData(0, targetID);
    }
  }


  // 当たり判定を行う
  private detectJudge(mesh, ThreeObject) {
    this.scene.render(); // 当たり判定をするため、一度描画する

    let judge: boolean = false; // 最終的な当たり判定

    const verticeList = this.AllStranaList[this.currentIndex].verticeList;

    // 対象のオブジェクトをdetectedObjectsにまとめる
    const detectedObjects = new Array();
    for (const id of Object.keys(this.AllStranaList)) {
      const target = this.AllStranaList[id].ThreeObject.children[0];
      if (target !== undefined) {
        detectedObjects.push(target);
      }
    }
    if (detectedObjects.length < 2) {
      return; // 既存のobjectがなければスルー
    }

    for (const vertice of verticeList) {
      let pointjudge: boolean = false;
      // 点の中心付近の点が他のオブジェクトに当たっているか確認
      // 全て当たっていれば、オブジェクト当たり判定はtrue(当たっている)
      // 一つでも当たっていなければ、オブジェクト当たり判定はfalse(当たっていない)
      for (let i = 0; i < 8; i++) {
        const delta = Math.PI / 4 * i + 0.0001; // 0.0001は角度微調整用の定数(Math.atan(1/10000))
        const delta_x = 0.0001 * Math.cos(delta);
        const delta_y = 0.0001 * Math.sin(delta);

        // 当たり判定用の光線を作成
        const TopPos = new THREE.Vector3(vertice.x + delta_x, vertice.y + delta_y, 255)
        const downVect = new THREE.Vector3(0,0,-1); 
        const ray = new THREE.Raycaster(TopPos, downVect.normalize());

        // 当たったobjectを検出する
        const objs = ray.intersectObjects(detectedObjects, true);
        if (objs.length >= 2) { //自身と既存のオブジェクトが検出されたら当たっているとみなす
          // ここで既存のオブジェクトが2重に検出されている可能性有（バグ）
          pointjudge = true;
          break;
        }
      }
      // 全てのpointjudgeがfalse(全ての点で当たっていない)であれば、何もしない。
      // pointjudgeが一つでもtrueであれば、何かする。 
      if (pointjudge) {
        //当たり判定の結果trueを受けて、何かする判定をする。そのためのフラグを作る
        judge = true;
        break;
      }
    }
    if (judge) { // 当たっているので何かする。
      const message = mesh.parent.name + '番の地層が不適切に作成されました';
      mesh.material.color.r = 1.00;
      alert(message);
    }
  }

  // 地表面データの1次式を回収
  public getDetectedObjects () {

    //const detectedObjects = [];
    this.max_x = -65535;
    this.min_x = 65535;

    for (const id of Object.keys(this.AllStranaList)) {
      // 地表面の左端と右端を調べる
      const verticeList = this.AllStranaList[id].verticeList;
      for (const node of verticeList) {
        this.max_x = Math.max(this.max_x, node.x);
        this.min_x = Math.min(this.min_x, node.x);
      }

      // 同時に当たり判定のobjectを回収する
      const ThreeObject = this.AllStranaList[id].ThreeObject;
      detectedObjects.push(ThreeObject);
    }
  }

  // 地表面データの1次式を回収
  public getGroundLinear () {
    let targetId:number;
    // const temp_GroundLinear = {};
    this.node.node;
    this.nodeData = Object.values(this.node.getNodeJson(0));

    for ( let x = this.min_x; x <= this.max_x; x += 0.1 ) {

      x = Math.round(x * 10) / 10;
      // 当たり判定用の光線を作成
      const TopPos = new THREE.Vector3(x, 65535, 0.0);
      const downVect = new THREE.Vector3(0,-1,0); 
      const ray = new THREE.Raycaster(TopPos, downVect.normalize());

      // 当たったobjectを検出する
      const objs = ray.intersectObjects(detectedObjects, true);
      let min_distance = objs[0].distance;
      for ( let num = 0; num < objs.length; num++ ) {
        min_distance = Math.min(min_distance, objs[num].distance)
      }
      const y = 65535 - min_distance;

      this.groundLinear[x.toString()] = new THREE.Vector2(x, y);
      if( this.nodeData.find((v) => ((v.x === x) && (v.y === y)))){
        let target = this.nodeData.find((v) => ((v.x === x) && (v.y === y)))
        targetId = target.id - 1;
        this.node.node[targetId].surface = true;
        console.log("aaa");
      };
    }

    return GroundLinear;
  }

}
