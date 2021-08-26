import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { LoadService } from '../../input/load/load.service';
import { SceneService } from '../scene.service';
import { CSS2DObject } from '../libs/CSS2DRenderer.js';
import { ThreeStranaService } from './three-strana.service';

@Injectable({
  providedIn: 'root',
})
export class ThreeLoadService {
  private currentIndex: string;
  private geometry: THREE.SphereBufferGeometry;

  public baseScale: number; // 最近点から求める基準のスケール

  public maxDistance: number;
  public minDistance: number;

  public groundLinear: any;

  
  private newNodeData: any;    // 変更された 節点データ

  private loadList: THREE.Object3D;
  private selectionItem: THREE.Object3D; // 選択中のアイテム
  public center: any; // すべての点の重心位置

  // 大きさを調整するためのスケール
  private scale: number;
  private params: any; // GUIの表示制御
  private gui: any;

  private objVisible: boolean;
  private txtVisible: boolean;

  constructor(private scene: SceneService, 
              private load: LoadService,
              private strana: ThreeStranaService) {
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
    let maxLoadAmount: number = 0;
    for (const key of jsonKeys) {
      maxLoadAmount = Math.max(maxLoadAmount, jsonData[key].loadAmount)
    }


    // 入力データに無い要素を排除する
    /* for (let i = this.loadList.children.length - 1; i >= 0; i--) {
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
    } */
    
    this.groundLinear = this.getGroundLinear();


    // 新しい入力を適用する
    for (const key of jsonKeys) {
      // 既に存在しているか確認する
      const item = this.loadList.children.find((target) => {
        return target.name === 'load' + key;
      });
      if (item !== undefined) {
        item.parent.remove(item)
      }// else {
        // ジオメトリを生成してシーンに追加
        const mesh = this.create(jsonData[key]);
        mesh.name = 'load' + key;
        mesh.position.set( this.groundLinear[jsonData[key].x_d].x,
                           this.groundLinear[jsonData[key].x_d].y, 0 );

        // スケールを調整する。（要調整）
        this.meshResize( mesh, jsonData[key].loadAmount / maxLoadAmount);

        this.loadList.add(mesh);


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
      //}
    }
    // サイズを調整する
    // this.setBaseScale();
    // this.onResize();

    return jsonData;
  }

    // 節点の入力が変更された場合 新しい入力データを保持しておく
    public changeNode(jsonData): void {
      this.newNodeData = jsonData;
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


  // 荷重メッシュを作る
  private create( loadData ): THREE.Object3D {

    const line = new THREE.Object3D();

    // 入力順に関わらず、小さい方をstartにする
    const start_x = (loadData.x_s < loadData.x_d) ? loadData.x_s : loadData.x_d;
    const end_x = (loadData.x_s < loadData.x_d) ? loadData.x_d : loadData.x_s;

    const start = new THREE.Vector2(start_x, this.getSurfaceY(start_x));
    const end = new THREE.Vector2(end_x, this.getSurfaceY(end_x));

    const points = [ start ];
    const span = 1.0;
    const len = end.x - start.x;
    const number = Math.floor(len / span) - 1;
    for (let n = 1; n < number + 1; n++ ) {
      const real_span = len / (number + 1);
      const x = start.x + real_span * n;
      
      points.push(new THREE.Vector2(x, this.getSurfaceY(x)));
    }
    points.push(end);

    const material = new THREE.LineBasicMaterial( { color: 0x000000 } )
    for (let i = 1; i < points.length; i++ ) {

      const line_child = new THREE.Object3D()
      const size = 0.7;

      const arrowPoints = [];
      arrowPoints.push( new THREE.Vector3( size * Math.cos(Math.PI / 3), size * Math.sin(Math.PI / 3), 0 ) );
      arrowPoints.push( new THREE.Vector3( 0, 0, 0 ) );
      arrowPoints.push( new THREE.Vector3( 0, size * 3, 0 ) );
      const geometry = new THREE.BufferGeometry().setFromPoints( arrowPoints );
      const arrow1 = new THREE.Line( geometry, material )
      arrow1.name = 'arrow'
      line_child.add( arrow1 );

      const arrow2 = new THREE.Line( geometry, material )
      arrow2.position.set( points[i].x - points[i - 1].x, 
                           points[i].y - points[i - 1].y,
                          0);
      arrow2.name = 'arrow';
      line_child.add( arrow2 );


      const coverPoints = [ new THREE.Vector3(points[i].x - points[i - 1].x, 
                                              points[i].y - points[i - 1].y + size * 3, 
                                              0 ), 
                            new THREE.Vector3( 0, size * 3, 0 )
                          ];
      const covergeometry = new THREE.BufferGeometry().setFromPoints( coverPoints );
      const cover = new THREE.Line( covergeometry, material );
      cover.name = 'cover';
      cover['memo'] = new THREE.Vector3(0, size * 3, 0);
      line_child.add(cover);

      line_child.position.set(points[i - 1].x - points[points.length - 1].x,
                              points[i - 1].y - points[points.length - 1].y,
                              0);

      line.add(line_child);
    }


    return line
  }

  // 荷重メッシュのscaleを調整する
  private meshResize (mesh, scale) {
    for (const num of Object.keys(mesh.children)) {
      const child = mesh.children[num];
      for (const num2 of Object.keys(child.children)) {
        const target = child.children[num2];
        if (target.name === 'arrow') {
          target.scale.set(1,scale,0)
        } else if (target.name === 'cover') {
          const p = target['memo'];
          target.position.set(p.x * 1, p.y * (scale - 1), p.z * 1);
        }
      }
    }
  }


  // 地表面データの1次式を回収
  public getGroundLinear () {

    const GroundLinear = {};
    // const temp_GroundLinear = {};

    let max_x: number = -65535;
    let min_x: number =  65535;
    const detectedObjects = [];

    for (const id of Object.keys(this.strana.AllStranaList)) {
      // 地表面の左端と右端を調べる
      const verticeList = this.strana.AllStranaList[id].verticeList;
      for (const node of verticeList) {
        max_x = Math.max(max_x, node.x);
        min_x = Math.min(min_x, node.x);
        /*if (node.x in temp_GroundLinear) {
          if ()
        } else {
          temp_GroundLinear[node.x] = node.y
        }*/
      }

      // 同時に当たり判定のobjectを回収する
      const ThreeObject = this.strana.AllStranaList[id].ThreeObject;
      detectedObjects.push(ThreeObject);
    }

    for ( let x = min_x; x <= max_x; x += 0.1 ) {
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
      GroundLinear[x.toString()] = new THREE.Vector2(x, y);
    }

    return GroundLinear;
  }

  // this.groundLinear(getGroundLinear)のデータを基に、二次元座標を入手する。
  private getSurfaceY (x: number) {
    let y: number;
    if (x in this.groundLinear) {
      y = this.groundLinear[x].y
    } else {
      const a = Math.floor(x * 10) / 10;
      const b = Math.round((a + 0.1)*10) / 10;
      const c = x % 0.1;
      if (!(a in this.groundLinear) || !(b in this.groundLinear)) {
        alert("getSurfaceYでエラーが発生しました。")
      }
      y = this.groundLinear[a].y + (this.groundLinear[a].y - this.groundLinear[b].y) * c
    }

    return y
  }


}
