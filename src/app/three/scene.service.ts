import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  // シーン
  private scene: THREE.Scene;
  public onFlg: boolean = false;

  // レンダラー
  private renderer!: THREE.WebGLRenderer;

  // カメラ
  private camera!: THREE.OrthographicCamera;
  // private aspectRatio: number = 0;
  // private Width: number = 0;
  // private Height: number = 0;

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

  }


  // 床面を生成する
  private createHelper() {
    this.GridHelper = new THREE.GridHelper(200, 20);
    this.GridHelper.geometry.rotateX(Math.PI / 2);
    this.scene.add(this.GridHelper);
  }

  // コントロール
  public addControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableRotate = false;
    controls.addEventListener('change', this.render);
  }

  // カメラの初期化
  public createCamera(w: number, h: number) {
    this.camera = new THREE.OrthographicCamera(
      -w / 40,
      w / 30,
      h / 20,
      -h / 60,
      0.1,
      200);

    this.camera.position.set(0, 0, 10);
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
        y: this.camera.position.y,
        z: this.camera.position.z,
      }
    };
  }

  // public RendererDomElement(): Node {
  //   return this.renderer.domElement;
  // }

}
