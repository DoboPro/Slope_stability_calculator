import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { PrintService } from '../print/print.service';

// import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { WaitDialogComponent } from '../wait-dialog/wait-dialog.component';

// import { UserInfoService } from '../../providers/user-info.service';
import * as FileSaver from 'file-saver';

import { InputDataService } from '../../providers/input-data.service';
import { ResultDataService } from '../../providers/result-data.service';
import { ThreeService } from '../three/three.service';
// import { ThreeSectionForceService } from '../three/geometry/three-section-force/three-section-force.service';

import * as pako from 'pako';
// import { DataCountService } from '../print/invoice/dataCount.service';

// import { AuthService } from '../../core/auth.service';
// import firebase from 'firebase';
import { SceneService } from '../three/scene.service';
import { UserInfoService } from 'src/app/providers/user-info.service';
import { SafetyRatioService } from '../result/safety-ratio/safety-ratio.service';
// import { DataHelperModule } from 'src/app/providers/data-helper.module';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss', '../../app.component.scss'],
})
export class MenuComponent implements OnInit {
  // loginUserName: string;
  // userPoint: string;
  // loggedIn: boolean;
  fileName: string;
  // isCalculated: boolean;
  // amount: number;
  // n:number = 3;
  input: any;

  constructor(
    private modalService: NgbModal,
    private app: AppComponent,
    private scene: SceneService,
    // public user: UserInfoService,
    private InputData: InputDataService,
    private ResultData: ResultDataService,
    private http: HttpClient,
    private three: ThreeService,
    private user: UserInfoService, // private helper:DataHelperModule
    public safety:SafetyRatioService
  ) {
    // this.loggedIn = this.user.loggedIn;
    this.fileName = '';
  }

  ngOnInit() {
    this.fileName = '斜面の安定計算ver 0.0.1';
    // this.user.isContentsDailogShow = false;
    // this.auth.user.subscribe(user => {
    //   console.log(user);
    // });

    // firebase.firestore().settings({
    //   ignoreUndefinedProperties: true,
    // })
  }

  // 新規作成
  renew(): void {
    this.app.dialogClose(); // 現在表示中の画面を閉じる
    this.InputData.clear();
    // this.ResultData.clear();
    // this.three.ClearData();
    this.fileName = '斜面の安定計算ver 0.0.1';
  }

  // ファイルを開く
  open(evt: any) {
    this.app.dialogClose(); // 現在表示中の画面を閉じる
    this.InputData.clear();
    // this.ResultData.clear();
    // this.three.ClearData();
    // this.countArea.clear();
    const modalRef = this.modalService.open(WaitDialogComponent);

    const file = evt.target.files[0];
    this.fileName = file.name;
    evt.target.value = '';
    this.fileToText(file)
      .then((text: any) => {
        this.app.dialogClose(); // 現在表示中の画面を閉じる
        //  const old = this.helper.dimension;
        this.InputData.loadInputData(text); // データを読み込む
        // if(old !== this.helper.dimension){
        //   this.setDimension(this.helper.dimension);
        // }
        this.three.fileload();
        modalRef.close();
      })
      .catch((err: any) => {
        alert(err);
        modalRef.close();
      });
  }

  private fileToText(file: any): any {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }

  // ファイルを保存
  save(): void {
    const inputJson: string = JSON.stringify(this.InputData.getInputJson());
    const blob = new window.Blob([inputJson], { type: 'text/plain' });
    if (this.fileName.length === 0) {
      this.fileName = 'soil.json';
    }
    let ext = '';
    if (this.InputData.getExt(this.fileName) !== 'json') {
      ext = '.json';
    }
    FileSaver.saveAs(blob, this.fileName + ext);
  }

  // 計算
  public calcrate(): void {
    // if (this.loggedIn === true) {
    // alert("計算を開始されるとお客様のポイントを消費しますが、よろしいですか？");
    // this.auth.calc(this.amount);
    // this.amount = this.auth.amount;
    const modalRef = this.modalService.open(WaitDialogComponent);

    const jsonData: {} = this.InputData.getInputJson(0);
    // console.log(JSON.stringify(jsonData));

    if ('error' in jsonData) {
      alert(jsonData['error']);
      modalRef.close(); // モーダルダイアログを消す
      return;
    }
    // this.ResultData.clear(); // 解析結果情報をクリア

    this.post_compress(jsonData, modalRef);
    // } else {
    //   alert("ログインしてください")
    // }
  }

  private post_compress(jsonData: {}, modalRef: NgbModalRef) {
    const url = 'https://asia-northeast1-team-dobopro.cloudfunctions.net/SlopeStabilityCalculator';

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      //  'text'
    };

    const js: string = JSON.stringify(jsonData);
    // const blob = new window.Blob([js], { type: 'text/plain' });
    // FileSaver.saveAs(blob, 'test.json');
    console.log(js);

    this.http.post(
      url,
      js,
      {headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    }).toPromise()
      .then(response => {
    
          // alert('解析に失敗しました\nエラーメッセージ：' + response);
          // this.router.navigate(['/condition']);  
          const re1 = response;    
          const obj = JSON.parse(re1);  
       
          const minX = obj['minX'];
          const minY = obj['minY'];
          const minR = obj['minR'];
          const reNode = obj["reNode"];

          this.safety.result(minX,minY,minR,reNode);

          this.ResultData.loadResultData(minX,minY,minR,reNode)

          modalRef.close();
          // const  = response['y'];
          // this.x = response['x'];
          // this.y= response['y'];
          // this.R = response['R'];
          // this.F= response['F'];
          
      },
        error => {
          alert('解析に失敗しました\n通信状態：' + error.statusText + '\nエラーメッセージ：' + error.message);
          console.log(error);
          // this.router.navigate(['/condition']);
        }
      );
  }


  // // ログイン関係
  // logIn(): void {
  //   this.app.dialogClose(); // 現在表示中の画面を閉じる
  //   this.modalService.open(LoginDialogComponent).result.then((result) => {
  //     const modalRef = this.modalService.open(WaitDialogComponent);
  //     this.loggedIn = this.user.loggedIn;
  //     setTimeout(() => {
  //       if (this.loggedIn === true) {
  //         this.userPoint = this.user.purchase_value.toString();
  //         this.amount = this.auth.amount;
  //       }
  //       modalRef.close();
  //     }, 200);
  //   });

  //   // 「ユーザー名」入力ボックスにフォーカスを当てる
  //   //document.getElementById("user_name_id").focus();
  // }

  // logOut(): void {
  //   this.loggedIn = false;
  //   this.user.clear();
  //   this.auth.signOut();
  // }

  // logout() {
  //   this.user.loggedIn = false;
  //   this.auth.signOut();
  //   this.user.clear();
  // }

  // //　印刷フロート画面用
  // public dialogClose(): void {
  //   this.user.isContentsDailogShow = false;
  // }

  public contentsDailogShow(id: string): void {
  this.deactiveButtons();
  document.getElementById(id)!.classList.add('active');
  this.user.isContentsDailogShow = true;
  //this.setDialogHeight();
}

// アクティブになっているボタンを全て非アクティブにする
deactiveButtons() {
  for (let i = 0; i <= 13; i++) {
    const data = document.getElementById(i + '');
    if (data != null) {
      if (data.classList.contains('active')) {
        data.classList.remove('active');
      }
    }
  }
}

  //
  // public setDimension(dim: number){
  //   this.app.dialogClose(); // 現在表示中の画面を閉じる
  //   this.helper.dimension = dim;
  //   this.scene.createCamera();    // three.js のカメラを変更する
  //   this.scene.addControls();
  //   this.scene.render();

  //   // html のラジオボタンの制御
  //   if(dim === 3){
  //     const g23D: any = document.getElementById("3D");
  //     g23D.checked = false;
  //     const g22D: any = document.getElementById("2D");
  //     g22D.checked = true;
  //   } else {
  //     const g23D: any = document.getElementById("3D");
  //     g23D.checked = true;
  //     const g22D: any = document.getElementById("2D");
  //     g22D.checked = false;
  //   }

  // }

  // public setDimension(dim:number = null){
  //   if(dim === null) {
  //     if(this.helper.dimension === 2) {
  //       this.helper.dimension = 3;
  //     } else{
  //       this.helper.dimension = 2;
  //     }
  //   }else{
  //     this.helper.dimension = dim;
  //     const g23D: any = document.getElementById("toggle--switch");
  //     g23D.checked = (this.helper.dimension === 3);
  //   }
  //   this.app.dialogClose(); // 現在表示中の画面を閉じる
  //   this.scene.createCamera();    // three.js のカメラを変更する
  //   this.scene.addControls();
  //   this.scene.render();
  // }

  // テスト ---------------------------------------------
  private saveResult(text: string): void {
  const blob = new window.Blob([text], { type: 'text/plain' });
  FileSaver.saveAs(blob, 'frameWebResult.json');
}

  //解析結果ファイルを開く
  // resultopen(evt) {
  //   const modalRef = this.modalService.open(WaitDialogComponent);

  //   const file = evt.target.files[0];
  //   this.fileName = file.name;
  //   evt.target.value = '';

  //   this.fileToText(file)
  //     .then(text => {

  //       this.app.dialogClose(); // 現在表示中の画面を閉じる
  //       this.ResultData.clear();
  //       const jsonData = JSON.parse(text);

  //       this.ResultData.loadResultData(jsonData);
  //       modalRef.close();

  //     })
  //     .catch(err => {
  //       alert(err);
  //       modalRef.close();
  //     });
  // }
  // --------------------------------------------- テスト */
}
