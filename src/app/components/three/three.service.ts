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

  constructor(private scene: SceneService,
    private surface: ThreeSurfaceService,
    private strana:ThreeStranaService,
    private waterlevel:ThreeWaterlevelService,
    private load:ThreeLoadService) { }


  //////////////////////////////////////////////////////
  // ファイルを開く処理する
  public fileload(): void {
    // ファイルを読み込んだ
    // this.surface.changeData();
    // this.load.changeData();
    // this.waterlevel.changeData();
    // this.strana.ResetData();
    // this.scene.render();
  }
}
