import { Injectable } from '@angular/core';
import { SceneService } from '../scene.service';
import { NodeService } from '../../input/node/node.service';
import { WaterlevelService } from '../../input/waterlevel/waterlevel.service';
import * as THREE from 'three';
import { Vector3 } from 'three';
// import { CSS2DObject } from '../libs';

@Injectable({
  providedIn: 'root'
})
export class ThreeWaterlevelService {
  private geometry!: THREE.SphereBufferGeometry;

  public baseScale!: number;   // 最近点から求める基準のスケール

  public maxDistance!: number;
  public minDistance!: number;

  private waterlevelList!: THREE.Object3D;
  private selectionItem!: THREE.Object3D;     // 選択中のアイテム
  public center: any; // すべての点の重心位置
  private currentIndex!: string;

  // 大きさを調整するためのスケール
  private scale: number;
  private params: any;          // GUIの表示制御
  private gui: any;

  private objVisible!: boolean;
  private txtVisible!: boolean;

  constructor(private scene: SceneService,
    private node: NodeService,
    private waterlevel: WaterlevelService) {

      //this.geometry = new THREE.SphereBufferGeometry(1);
      this.waterlevelList = new THREE.Object3D();
      // this.ClearData();
      this.scene.add(this.waterlevelList);
      this.currentIndex = "0";
  
      this.objVisible = true;
      this.txtVisible = false;
  
      // gui
      this.scale = 100;
      this.params = {
        waterlevelNo: this.txtVisible,
        waterlevelScale: this.scale
      };
      this.gui = null;

     }

    //  public OnInit(): void { 
    //   // 節点番号の表示を制御する gui を登録する
    //   this.scene.gui.add( this.params, 'nodeNo' ).onChange( ( value: boolean ) => {
    //     for (const mesh of this.waterlevelList.children) {
    //       if(this.waterlevelList.children){
    //       mesh.getObjectByName('font').visible = value;
    //       }else{
    //         return;
    //       }
    //     }
    //     this.txtVisible = value;
    //     this.scene.render();
    //   });
  
    // }

  public changeData() {
    // 入力データを入手
    const nodeData = this.node.getNodeJson(0);
    const nodeKeys = Object.keys(nodeData);
    /* if (nodeKeys.length <= 0) {
      this.ClearData();
      return;
    } */

    const jsonData = this.waterlevel.getWaterLevelJson(0);
    const jsonKeys = Object.keys(jsonData);
    if (jsonKeys.length < 3) {
      this.ClearData();
      return;
    }

    // 新しい入力を適用する
    //for (const key of jsonKeys) {
      // 既に存在しているか確認する
      const item = this.waterlevelList.children.find((target) => {
        return target.name === 'WaterLevel';
      });
      if (item !== undefined ) {
        // すでに要素が存在している場合座標の更新
        this.waterlevelList.remove(item);
      } 
      //else {

      // 頂点座標を抽出
      const verticeList = []
      for (const id of Object.keys(jsonData)) {
        const data = jsonData[id]
        if (data.x === null && data.y === null){
          return
        }
        verticeList.push(data)
      }
      if (verticeList.length < 3) {
        return;
      }

      // nodeの中の左下([0])と右下([1])の座標を入手
      let leftid : string = nodeKeys[0];
      let rightid : string = nodeKeys[0];
      for (const id of nodeKeys) {
        const target = nodeData[id];
        if (nodeData[leftid].y >= target.y) { 
          if (nodeData[leftid].x >= target.x) {
            leftid = id;
          }
          if (nodeData[rightid].x <= target.x) {
            rightid = id;
          }
        }
      }
      const pickupNode = [new Vector3(nodeData[leftid].x, nodeData[leftid].y, 0), 
                          new Vector3(nodeData[rightid].x, nodeData[rightid].y, 0)];

      const mesh = this.create(verticeList, pickupNode);

      this.waterlevelList.children.push(mesh);  // 水位線の面＞線
        //this.nodeList.add(mesh);
        // this.scene.add(this.nodeList);

        // 文字をシーンに追加
        /* const div = document.createElement('div');
        div.className = 'label';
        div.textContent = key;
        div.style.marginTop = '-1em';
        const label = new CSS2DObject(div);
        label.position.set(1.41, 1.41, 1.41);
        label.name = 'font';

        label.visible = this.txtVisible;
        //label.visible = true;
        mesh.add(label); */
      //}
    //}
  }

  private create( vertice, pickupNode ) { // 水位線のmeshとlineを描く

    const shape = new THREE.Shape();  // meshのルート
    const point = []; // lineのルート

    shape.moveTo(0, 0);
    point.push(new Vector3(0, 0, 0))

    // 入力データをたどる
    for (let num = 1; num < vertice.length; num++) {
      const x = vertice[num].x - vertice[0].x;
      const y = vertice[num].y - vertice[0].y;
      shape.lineTo(x, y);
      point.push(new Vector3(x, y, 0));
    }
    //point.push(new Vector3(0, 0, 0))

    // 全体のnodeの左下と右下の点がmeshには必要なので、通過
    if ( (pickupNode[1].x + pickupNode[0].x) / 2 > vertice[vertice.length - 1].x) {
      shape.lineTo(pickupNode[0].x - vertice[0].x, pickupNode[0].y - vertice[0].y);
      shape.lineTo(pickupNode[1].x - vertice[0].x, pickupNode[1].y - vertice[0].y);
    } else { 
      shape.lineTo(pickupNode[1].x - vertice[0].x, pickupNode[1].y - vertice[0].y);
      shape.lineTo(pickupNode[0].x - vertice[0].x, pickupNode[0].y - vertice[0].y);
    }

    // meshを描画
    const geometry = new THREE.ShapeBufferGeometry( shape );
    const material = new THREE.MeshBasicMaterial({ color: 0xafeeee });
    const mesh = new THREE.Mesh( geometry, material );

    const geo = new THREE.BufferGeometry().setFromPoints( point );
    const mat = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const line = new THREE.Line(geo, mat);
    line.name = 'WaterLevel_Line';
    line.position.set(vertice[0].x, vertice[0].y, 1)

    mesh.children.push(line)
    mesh.name = 'WaterLevel';
    mesh.position.set(vertice[0].x, vertice[0].y, -1)

    return mesh
    //return [mesh, line]
  }
  
  
  // データをクリアする
  public ClearData(): void {
    for (const mesh of this.waterlevelList.children) {
      // 文字を削除する
      while (mesh.children.length > 0) {
        const object = mesh.children[0];
        object.parent.remove(object);
      }
    }
    // オブジェクトを削除する
    this.waterlevelList.children = new Array();
    // this.nodeList = new Array();
    this.baseScale = 1;
    this.maxDistance = 0;
    this.minDistance = 0;
    this.center = { x: 0, y: 0 };
  }

    //シートの選択行が指すオブジェクトをハイライトする
  public selectChange(index): void{

    if (this.currentIndex === index){
      //選択行の変更がないとき，何もしない
      return
    }

    //全てのハイライトを元に戻し，選択行のオブジェクトのみハイライトを適応する
    for (let item of this.waterlevelList.children){

      item['material']['color'].setHex(0X000000);

      if (item.name === 'node' + index.toString()){

        item['material']['color'].setHex(0X00A5FF);
      }
    }

    this.currentIndex = index;

    this.scene.render();
  }


}
