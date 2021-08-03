import { Injectable } from '@angular/core';
import * as THREE from "three";
import { SurfaceService } from '../../input/surface/surface.service';
import { SceneService } from '../scene.service';

@Injectable({
  providedIn: 'root'
})
export class ThreeSurfaceService {
  private currentIndex: string;
  private geometry: THREE.SphereBufferGeometry;

  public baseScale: number;   // 最近点から求める基準のスケール

  public maxDistance: number;
  public minDistance: number;

  private nodeList: THREE.Object3D;
  private selectionItem: THREE.Object3D;     // 選択中のアイテム
  public center: any; // すべての点の重心位置

  // 大きさを調整するためのスケール
  private scale: number;
  private params: any;          // GUIの表示制御
  private gui: any;

  private objVisible: boolean;
  private txtVisible: boolean;
 
  constructor(private scene: SceneService,
              private surface: SurfaceService) {

    this.geometry = new THREE.SphereBufferGeometry(1);
    this.nodeList = new THREE.Object3D();
    // this.ClearData();
    this.scene.add(this.nodeList);
    this.currentIndex = null;

    this.objVisible = true;
    this.txtVisible = false;

    // gui
    this.scale = 100;
    this.params = {
      nodeNo: this.txtVisible,
      nodeScale: this.scale
    };
    this.gui = null;

  }
  
  //シートの選択行が指すオブジェクトをハイライトする
  public selectChange(index): void{

    if (this.currentIndex === index){
      //選択行の変更がないとき，何もしない
      return
    }

    //全てのハイライトを元に戻し，選択行のオブジェクトのみハイライトを適応する
    for (let item of this.nodeList.children){

      item['material']['color'].setHex(0X000000);

      if (item.name === 'surface' + index.toString()){

        item['material']['color'].setHex(0X00A5FF);
      }
    }

    this.currentIndex = index;

    this.scene.render();
  }
}
