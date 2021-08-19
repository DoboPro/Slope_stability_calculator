import { Injectable } from '@angular/core';
import { StranaService } from '../input/strana/strana.service';
import { NodeService } from '../input/node/node.service';
import { ThreeLoadService } from './geometry/three-load.service';
import { ThreeNodeService } from './geometry/three-node.service';
import { ThreeSoilService } from './geometry/three-soil.service';
import { ThreeStranaService } from './geometry/three-strana.service';
import { ThreeWaterlevelService } from './geometry/three-waterlevel.service';
import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {

  private mode: string;
  private currentIndex: number;

  constructor(private scene: SceneService,
    private node: ThreeNodeService,
    private soil: ThreeSoilService,
    private strana: ThreeStranaService,
    private waterlevel: ThreeWaterlevelService,
    private load: ThreeLoadService) { }

  //////////////////////////////////////////////////////
  // 初期化
  public OnInit(): void {
    this.node.OnInit();
    // this.member.OnInit();
  }


  //////////////////////////////////////////////////////
  // ファイルを開く処理する
  public fileload(): void {
    // ファイルを読み込んだ
    this.node.changeData();
    // this.load.changeData();
    // this.waterlevel.changeData();
    // this.strana.ResetData();
    // this.scene.render();
  }

  //////////////////////////////////////////////////////
  // データの変更通知を処理する
  public changeData(mode: string = "", index: number = 0): void {
    switch (mode) {
      case "node":
        this.node.changeNode(
          this.node.changeData());
        break;
      

      //   case "waterlevel":
      //     this.waterlevel.changeData();
      //     break;

      //   case "load":
      //     this.load.changeData();
      //     break;

      case "soil":
        this.soil.changeCase(index);
        break;

      case "strana":
        this.strana.changeData(index);
        break;

      default:
        // 何御しない
        return;
    }

    // 再描画
    this.scene.render();

    this.currentIndex = index;
  }

  //////////////////////////////////////////////////////
  // データの選択を処理する
  public selectChange(mode: string, index: number, index_sub: number): void {
    //console.log("selectChange", mode, index, index_sub);

    switch (mode) {
      case "node":
        this.node.selectChange(index);
        break;

      case "waterlevel":
        this.waterlevel.selectChange(index);
        break;


      case "load":
        this.load.selectChange(index);
        break;

      case "soil":
        // this.load.selectChange(index);
        break;
    }
  }

  // 再描画
  //     this.scene.render();
  // this.currentIndex = index;

  //////////////////////////////////////////////////////
  // 編集ページの変更通知を処理する
  public ChangePage(currentPage: number): void {
    if (this.currentIndex === currentPage) {
      return;
    }

    switch (this.mode) {


      case "soil":
        this.soil.changeCase(currentPage);
        break;


        this.currentIndex = currentPage;

        // 再描画
        this.scene.render();
    }
  }

  //////////////////////////////////////////////////////
  // 編集モードの変更通知を処理する
  public ChangeMode(ModeName: string): void {
    if (this.mode === ModeName) {
      return;
    }

    if (ModeName === "nodes") {
      //this.node.visibleChange(true, true, true);
      //this.soil.visibleChange(true, false, false);
      //this.strana.visibleChange(false);
    }

    if (ModeName === "soil") {
      //this.node.visibleChange(true, false, false);
      this.soil.visibleChange(true, true);
      //this.strana.visibleChange(false);
    }

    if (ModeName === "strana") {
      //this.node.visibleChange(true, false, false);
      //this.soil.visibleChange(true, true, false);
      //this.strana.visibleChange(false);
    }

    /* if (ModeName === "joints") {
      this.node.visibleChange(true, false, false);
      this.member.visibleChange(true, true, false);
      this.fixNode.visibleChange(false);
    } */

    this.mode = ModeName;
    this.currentIndex = -1;

    // 再描画
    this.scene.render();
  }

  //////////////////////////////////////////////////////
  // マウス位置とぶつかったオブジェクトを検出する
  public detectObject(mouse: THREE.Vector2, action: string): void {
    const raycaster = this.scene.getRaycaster(mouse);

    switch (this.mode) {
      case "node": // 節点データの更新
        this.node.detectObject(raycaster, action);
        break;


    }
    // 再描画
    //this.scene.render();
  }
}
