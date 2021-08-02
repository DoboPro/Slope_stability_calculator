import { Injectable } from '@angular/core';
import { SceneService } from '../scene.service';
import { WaterlevelService } from '../../input/waterlevel/waterlevel.service';
import * as THREE from 'three';
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
  private scale!: number;
  private params: any;          // GUIの表示制御
  private gui: any;

  private objVisible!: boolean;
  private txtVisible!: boolean;

  constructor(private scene: SceneService,
    private waterlevel: WaterlevelService) {

      this.geometry = new THREE.SphereBufferGeometry(1);
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


}
