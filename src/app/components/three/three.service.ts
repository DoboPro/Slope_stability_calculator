import { Injectable } from '@angular/core';
import { StranaService } from '../input/strana/strana.service';
import { SurfaceService } from '../input/surface/surface.service';
import { ThreeLoadService } from './geometry/three-load.service';
import { ThreeStranaService } from './geometry/three-strana.service';
import { ThreeSurfaceService } from './geometry/three-surface.service';
import { ThreeWaterlevelService } from './geometry/three-waterlevel.service';
import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {

  private mode: string;
  private currentIndex: number;

  constructor(private scene: SceneService,
    private surface: ThreeSurfaceService,
    private strana: ThreeStranaService,
    private waterlevel: ThreeWaterlevelService,
    private load: ThreeLoadService) { }

  //////////////////////////////////////////////////////
  // 初期化
  public OnInit(): void {
    this.surface.OnInit();
    // this.member.OnInit();
  }


  //////////////////////////////////////////////////////
  // ファイルを開く処理する
  public fileload(): void {
    // ファイルを読み込んだ
    this.surface.changeData();
    // this.load.changeData();
    // this.waterlevel.changeData();
    // this.strana.ResetData();
    // this.scene.render();
  }

  //////////////////////////////////////////////////////
  // データの変更通知を処理する
  public changeData(mode: string = "", index: number = 0): void {
    switch (mode) {
      case "surface":
        this.surface.changeNode(
          this.surface.changeData());
        break;

      //   case "waterlevel":
      //     this.waterlevel.changeData();
      //     break;

      //   case "load":
      //     this.load.changeData();
      //     break;

      //     case "soil":
      //       // this.load.selectChange(index);
      //       break;
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
      case "surface":
        this.surface.selectChange(index);
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
        this.strana.changeCase(currentPage);
        break;


        this.currentIndex = currentPage;

        // 再描画
        this.scene.render();
    }
  }

  //////////////////////////////////////////////////////
  // マウス位置とぶつかったオブジェクトを検出する
  public detectObject(mouse: THREE.Vector2, action: string): void {
    const raycaster = this.scene.getRaycaster(mouse);

    switch (this.mode) {
      case "surface": // 節点データの更新
        this.surface.detectObject(raycaster, action);
        break;


    }
    // 再描画
    //this.scene.render();
  }
}
