import { Component, OnInit, ViewChild } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { StranaService } from "./strana.service";
import { ThreeService } from "../../three/three.service";
// import { DataHelperModule } from "../../../providers/data-helper.module";
import { SheetComponent } from "../sheet/sheet.component";
import pq from "pqgrid";
import { AppComponent } from "src/app/app.component";


@Component({
  selector: 'app-soil',
  templateUrl: './soil.component.html',
  styleUrls: ['./soil.component.scss', "../../../app.component.scss",]
})
export class SoilComponent implements OnInit {
  @ViewChild('grid') grid: SheetComponent;

  private dataset = [];

 private initSelect0 = [ "赤", "青", "緑" ];
   /* private initSelect = { "赤": 0xff0000, "青" : 0x0000ff, "緑": 0x00ff00 };
  private initSelect2 = [{ 0xff0000: "赤", 0x0000ff: "青", 0x00ff00: "緑" }];
  private initSelect3 = [ { color: "red", code: 0xff0000, cls: 0xff0000}, 
                          { color: "blue", code: 0x0000ff, cls: 0xff0000},
                          { color: "green", code: 0x00ff00, cls: 0xff0000} ]; */

  private columnHeaders = [
    { title: "地層名", dataType: "string", dataIndx: "name", sortable: false, width: 250 },
    { title: "γ", dataType: "float", format: "#.0", dataIndx: "gamma", sortable: false, width: 50 },
    { title: "c", dataType: "float", format: "#.0", dataIndx: "cohesion", sortable: false, width: 50 },
    { title: "φ", dataType: "float", format: "#.0", dataIndx: "fai", sortable: false, width: 50 },
    { title: "色", dataType: "select", dataIndx: "color", sortable: false, width: 50, //},
       editor: { type: "select",  
               /*  mapIndices: { color: "color", code: "code" },
                lavelIndx: 'color', 
                valueIndx: 'code', 
                prepend: { "" : "" }, */
                options: this.initSelect0,
              } 
    },
  ];

  private ROWS_COUNT = 15;
  public inner_width = 810;

  constructor(
    private data: StranaService,
    private app: AppComponent,
    private three: ThreeService) {
      // this.loadData(this.ROWS_COUNT);
     }

  ngOnInit(): void {
    this.ROWS_COUNT = this.rowsCount();
    // three.js にモードの変更を通知する
    // this.three.ChangeMode("node");

    this.three.ChangeMode("soil");
    // this.three.ChangePage(1);
  }

  // 指定行row 以降のデータを読み取る
  private loadData(row: number): void {
    for (let i = this.dataset.length + 1; i <= row; i++) {
      const load = this.data.getSoilColumns(i);
      this.dataset.push(load);
    }
  }

  // 表の高さを計算する
  private tableHeight(): string {
    const containerHeight = this.app.getDialogHeight();
    return containerHeight.toString();
  }
  // 表高さに合わせた行数を計算する
  private rowsCount(): number {
    const containerHeight = this.app.getDialogHeight();
    return Math.round(containerHeight / 30);
  }

  // グリッドの設定
  options: pq.gridT.options = {
    showTop: false,
    reactive: true,
    sortable: false,
    locale: "jp",
    height: this.tableHeight(),
    numberCell: {
      show: true, // 行番号
      width: 45
    },
    colModel: this.columnHeaders,
    animModel: {
      on: true
    },
    dataModel: {
      data: this.dataset
    },
    beforeTableView: (evt, ui) => {
      const finalV = ui.finalV;
      const dataV = this.dataset.length;
      if (ui.initV == null) {
        return;
      }
      if (finalV >= dataV - 1) {
        this.loadData(dataV + this.ROWS_COUNT);
        this.grid.refreshDataAndView();
      }
    },
    selectEnd: (evt, ui) => {
      const range = ui.selection.iCells.ranges;
      const row = range[0].r1 ;
      const caseNo = range[0].c1;
      this.three.ChangePage(caseNo);
    },
    change: (evt, ui) => {
      let target: any = null;
      for (let i = 0; i < ui.updateList.length; i++) {
        target = ui.updateList[i];
      }
      this.three.changeData("soil", target.rowIndx + 1)
    }
  };

  width = 600;

}
