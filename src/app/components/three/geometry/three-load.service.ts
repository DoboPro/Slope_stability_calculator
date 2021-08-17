import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { LoadService } from '../../input/load/load.service';
import { SceneService } from '../scene.service';
import { CSS2DObject } from '../libs/CSS2DRenderer.js';

@Injectable({
  providedIn: 'root',
})
export class ThreeLoadService {
  private currentIndex: string;
  private geometry: THREE.SphereBufferGeometry;

  public baseScale: number; // 最近点から求める基準のスケール

  public maxDistance: number;
  public minDistance: number;

  private loadList: THREE.Object3D;
  private selectionItem: THREE.Object3D; // 選択中のアイテム
  public center: any; // すべての点の重心位置

  // 大きさを調整するためのスケール
  private scale: number;
  private params: any; // GUIの表示制御
  private gui: any;

  private objVisible: boolean;
  private txtVisible: boolean;

  constructor(private scene: SceneService, private load: LoadService) {
    this.geometry = new THREE.SphereBufferGeometry(1);
    this.loadList = new THREE.Object3D();
    this.ClearData();
    this.scene.add(this.loadList);
    this.currentIndex = null;

    this.objVisible = true;
    this.txtVisible = false;

    // gui
    this.scale = 100;
    this.params = {
      loadNo: this.txtVisible,
      loadScale: this.scale,
    };
    this.gui = null;
  }

  // 初期化
  public OnInit(): void {
    // 節点番号の表示を制御する gui を登録する
    this.scene.gui.add(this.params, 'loadNo').onChange((value) => {
      for (const mesh of this.loadList.children) {
        mesh.getObjectByName('font').visible = value;
      }
      this.txtVisible = value;
      this.scene.render();
    });
  }

  // データが変更された時の処理
  public changeData(): object {
    // 入力データを入手
    const jsonData = this.load.getloadJson(0);
    const jsonKeys = Object.keys(jsonData);
    if (jsonKeys.length <= 0) {
      this.ClearData();
      return null;
    }

    // 入力データに無い要素を排除する
    for (let i = this.loadList.children.length - 1; i >= 0; i--) {
      const item = jsonKeys.find((key) => {
        return key === this.loadList.children[i].name;
      });
      if (item === undefined) {
        const target = this.loadList.children[i];
        while (target.children.length > 0) {
          const object = target.children[0];
          object.parent.remove(object);
        }
        this.loadList.children.splice(i, 1);
      }
    }

    // 新しい入力を適用する
    for (const key of jsonKeys) {
      // 既に存在しているか確認する
      const item = this.loadList.children.find((target) => {
        return target.name === key;
      });
      if (item !== undefined) {
        // すでに同じ名前の要素が存在している場合座標の更新
        // item.position.x_s = jsonData[key].x_s;
        // item.position.x_d = jsonData[key].x_d;
        // item.position.loadAmount = jsonData[key].loadAmount;
      } else {
        // ジオメトリを生成してシーンに追加
        const mesh = new THREE.Mesh(
          this.geometry,
          new THREE.MeshBasicMaterial({ color: 0x00a5ff })
        );
        mesh.name = 'load' + key;
        mesh.position.x = jsonData[key].x_s;
        mesh.position.y = jsonData[key].x_d;

        this.loadList.children.push(mesh);
        this.loadList.add(mesh);
        // this.scene.add(this.loadList);

        // 文字をシーンに追加
        const div = document.createElement('div');
        div.className = 'label';
        div.textContent = key;
        div.style.marginTop = '-1em';
        const label = new CSS2DObject(div);
        label.position.set(0, 0.27, 0);
        label.name = 'font';

        label.visible = this.txtVisible;
        mesh.add(label);
      }
    }
    // サイズを調整する
    // this.setBaseScale();
    // this.onResize();

    return jsonData;
  }

  // データをクリアする
  public ClearData(): void {
    for (const mesh of this.loadList.children) {
      // 文字を削除する
      while (mesh.children.length > 0) {
        const object = mesh.children[0];
        object.parent.remove(object);
      }
    }
    // オブジェクトを削除する
    this.loadList.children = new Array();
    // this.loadList = new Array();
    this.baseScale = 1;
    this.maxDistance = 0;
    this.minDistance = 0;
    this.center = { x_s: 0, x_d: 0 };
  }

  //シートの選択行が指すオブジェクトをハイライトする
  public selectChange(index): void {
    if (this.currentIndex === index) {
      //選択行の変更がないとき，何もしない
      return;
    }

    //全てのハイライトを元に戻し，選択行のオブジェクトのみハイライトを適応する
    for (let item of this.loadList.children) {
      item['material']['color'].setHex(0x000000);

      if (item.name === 'load' + index.toString()) {
        item['material']['color'].setHex(0x00a5ff);
      }
    }

    this.currentIndex = index;

    this.scene.render();
  }
}
