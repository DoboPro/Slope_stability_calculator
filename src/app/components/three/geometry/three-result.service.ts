import { Injectable } from '@angular/core';
import { SceneService } from '../scene.service';
import { NodeService } from '../../input/node/node.service';
import { WaterlevelService } from '../../input/waterlevel/waterlevel.service';
import * as THREE from 'three';
import { Line, Vector3 } from 'three';
// import { CSS2DObject } from '../libs';

@Injectable({
  providedIn: 'root'
})
export class ThreeResultService {
  private geometry!: THREE.SphereBufferGeometry;

  public baseScale!: number;   // 最近点から求める基準のスケール

  public maxDistance!: number;
  public minDistance!: number;

  private resultList: THREE.Object3D;
  private selectionItem!: THREE.Object3D;     // 選択中のアイテム
  public center: any; // すべての点の重心位置

  private objVisible!: boolean;
  private txtVisible!: boolean;

  constructor(private scene: SceneService,
    private node: NodeService,
    private waterlevel: WaterlevelService) {

      this.resultList = new THREE.Object3D();
      this.scene.add(this.resultList);

    }

    // オブジェクトを削除する
    public clearData() {

      if (this.resultList.children.length === 0) {
        return;
      }

      for (const key of Object.keys(this.resultList.children)) {
        const child = this.resultList.children[key];
        child.parent.remove(child);
      }

    }
  
    public setResultData(circleData, circleNode) {
      this.resultList.name = 'resultList'

      this.changeData(circleData, circleNode);

      this.scene.render();
    }

    private changeData(circleData, circleNode){

      const objects = new THREE.Object3D();

      // objectを回収
      objects.add(this.createLines(circleData, circleNode)); // 扇形
      objects.add(this.createPoints(circleData, circleNode)); // プロットと中心点
      //objects.add(this.createMesh(circleData, circleNode)); // プロットで構成される台形
      //objects.add(this.creategrid(circleData, circleNode)); // 中心点付近のグリッド

      objects.position.set(circleData.x, circleData.y, 1.2)
      this.resultList.add(objects);

    }

    // 扇形の線を描く
    private createLines(circleData, circleNode): THREE.Object3D{
      const Lines = new THREE.Object3D;
      Lines.name = 'fan-shape';

      const curve_s = new THREE.Vector2( circleNode[0].x - circleData.x, 
                                         circleNode[0].y - circleData.y );
      const curve_d = new THREE.Vector2( circleNode[circleNode.length - 1].x - circleData.x, 
                                         circleNode[circleNode.length - 1].y - circleData.y );
      const rad_s = Math.atan2(curve_s.y, curve_s.x);
      const rad_d = Math.atan2(curve_d.y, curve_d.x);

      // 弧を描く
      const curve = new THREE.EllipseCurve(
        0,
        0, // ax, aY
        circleData.r,
        circleData.r, // xRadius, yRadius
        rad_s,
        rad_d, // aStartAngle, aEndAngle
        false, // aClockwise
        0 // aRotation
      );
      const curve_points = curve.getPoints( 63 );
      const curve_geometry = new THREE.BufferGeometry().setFromPoints( curve_points );    
      const material = new THREE.LineDashedMaterial( { color : 0xff0000, dashSize : 0.4, gapSize: 0.2 } );
      const ellipse = new THREE.Line( curve_geometry, material );
      ellipse.name = 'curve';
      ellipse.computeLineDistances();

      Lines.add(ellipse)

      // 地表面から中心点までの直線を描く
      const points = [new THREE.Vector3(curve_s.x, curve_s.y, 0), 
                      new THREE.Vector3(        0,         0, 0), 
                      new THREE.Vector3(curve_d.x, curve_d.y, 0)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints( points );  
      const centerLine = new THREE.Line( geometry, material );
      centerLine.name = 'line';
      centerLine.computeLineDistances();
      Lines.add(centerLine);

      return Lines
    }

    // すべり円弧上の点及び中心点をプロットする
    private createPoints(circleData, circleNode): THREE.Object3D{
      const points = new THREE.Object3D;
      points.name = 'points'

      for (const key of Object.keys(circleNode)) {
        const point = circleNode[key]
        const x = point.x - circleData.x;
        const y = point.y - circleData.y;

        const sphere = new THREE.Mesh(
          new THREE.SphereBufferGeometry(0.1),
          new THREE.MeshBasicMaterial({ color: 0xff8080 })
        );
        sphere.position.set(x, y, 0);
        points.add(sphere)
      };

      const center = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.2),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      );
      center.position.set(0, 0, 0);
      center.name = "center-point";
      points.add(center);

      return points
    };


}
