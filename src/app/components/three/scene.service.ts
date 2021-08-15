import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';
import { GUI } from './libs/dat.gui.module.js';
import { CSS2DRenderer, CSS2DObject } from './libs/CSS2DRenderer.js';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  // シーン
  private scene: THREE.Scene;
  public onFlg: boolean = false;

  // レンダラー
  private renderer!: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;

  // カメラ
  private camera!: THREE.OrthographicCamera;
  private aspectRatio: number;
  private Width: number;
  private Height: number;

  // gui
  public gui: GUI;
  private params: any;          // GridHelperの表示制御

  // helper
  private axisHelper: THREE.AxesHelper;
  private GridHelper!: THREE.GridHelper;

  // 初期化
  public constructor() {
    // シーンを作成
    this.scene = new THREE.Scene();
    // シーンの背景を白に設定
    // this.scene.background = new THREE.Color(0xf0f0f0);
    this.scene.background = new THREE.Color(0xffffff);
    // レンダラーをバインド
    this.render = this.render.bind(this);

    // gui
    this.params = {
      GridHelper: true,
    };

  }

  public OnInit(aspectRatio: number,
    canvasElement: HTMLCanvasElement,
    deviceRatio: number,
    Width: number,
    Height: number): void {
    // カメラ
    this.createCamera(Width, Height);
    // 環境光源
    this.add(new THREE.AmbientLight(0xf0f0f0));
    // レンダラー
    this.createRender(canvasElement,
      deviceRatio,
      Width,
      Height);
    // コントロール
    this.addControls();

    // 床面を生成する
    this.createHelper();

    //
    this.gui = new GUI();
    this.gui.domElement.id = 'gui_css';
    this.gui.add(this.params, 'GridHelper').onChange((value) => {
      // guiによる設定
      this.axisHelper.visible = value;
      this.GridHelper.visible = value;
      this.render();
    });
    this.gui.open();

  }


  // 床面を生成する
  private createHelper() {
    this.GridHelper = new THREE.GridHelper(200, 20);
    this.GridHelper.geometry.rotateX(Math.PI / 2);
    this.scene.add(this.GridHelper);
    this.GridHelper.material['opacity'] = 0.2;
    this.GridHelper.material['transparent'] = true;
    this.scene.add(this.GridHelper);
  }

  // コントロール
  public addControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableRotate = false;
    controls.addEventListener('change', this.render);
  }

  // カメラの初期化
  public createCamera(Width: number = null, Height: number = null) {
    this.camera = new THREE.OrthographicCamera(
      -Width / 10, Width / 10,
      Height / 10, -Height / 10,
      0.1,
      21);

    this.camera.position.set(0, 0, 10);
    this.camera.name = 'camera';
    this.scene.add(this.camera);

  }

  // レンダラーを初期化する
  public createRender(canvasElement: HTMLCanvasElement,
    deviceRatio: number,
    Width: number,
    Height: number): void {
    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      canvas: canvasElement,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setPixelRatio(deviceRatio);
    this.renderer.setSize(Width, Height);
    this.renderer.shadowMap.enabled = true;

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(Width, Height);
    this.labelRenderer.domElement.style.position = 'absolute';
  }


  // リサイズ
  public onResize(deviceRatio: number,
    Width: number,
    Height: number): void {
  

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(Width, Height);
    this.render();


  }

  // レンダリングする
  public render() {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  // レンダリングのサイズを取得する
  public getBoundingClientRect(): ClientRect | DOMRect {
    return this.renderer.domElement.getBoundingClientRect();
  }

  // シーンにオブジェクトを追加する
  public add(...threeObject: THREE.Object3D[]): void {
    for (const obj of threeObject) {
      this.scene.add(obj);
    }
  }


  // シーンのオブジェクトを削除する
  public remove(...threeObject: THREE.Object3D[]): void {
    for (const obj of threeObject) {
      this.scene.remove(obj);
    }
  }

  // シーンにオブジェクトを削除する
  public removeByName(...threeName: string[]): void {
    for (const name of threeName) {
      const target = this.scene.getObjectByName(name);
      if (target === undefined) {
        continue;
      }
      this.scene.remove(target);
    }
  }

  // ファイルに視点を保存する
  public getSettingJson(): any {
    return {
      camera: {
        x: this.camera.position.x,
        y: this.camera.position.y
      }
    };
  }

  public RendererDomElement(): Node {
    return this.renderer.domElement;
  }

  // 物体とマウスの交差判定に用いるレイキャスト
  public getRaycaster(mouse: THREE.Vector2): THREE.Raycaster {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    return raycaster;
  }

  // 視点を読み込む
  public setSetting(jsonData: {}): void {
    if (!('three' in jsonData)) {
      return;
    }
    const setting: any = jsonData['three'];
    const x: number = this.toNumber(setting.camera.x);
    if (x !== null) {
      const y: number = this.toNumber(setting.camera.y);
    }
  }

  // 文字列string を数値にする
  public toNumber(num: string, digit: number = null): number {
    let result: any;
    try {
      const tmp: string = num.toString().trim();
      if (tmp.length > 0) {
        result = ((n: number) => (isNaN(n) ? null : n))(+tmp);
      }
    } catch {
      result = null;
    }
    if (digit != null) {
      const dig: number = 10 ** digit;
      result = Math.round(result * dig) / dig;
    }
    return result;
  }

}
