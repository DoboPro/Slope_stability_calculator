import { Component, OnInit, ViewChild } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
// import { InputStranaService } from "./input-load.service";
import { DataHelperModule } from '../../../providers/data-helper.module';
import { ThreeService } from '../../three/three.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';
import { AppComponent } from 'src/app/app.component';
import { StranaService } from './strana.service';

@Component({
  selector: 'app-strana',
  templateUrl: './strana.component.html',
  styleUrls: ['./strana.component.scss', '../../../app.component.scss'],
})
export class StranaComponent implements OnInit {
  @ViewChild('grid') grid: SheetComponent;

  public strana_name: string;
  private dataset = [];
  private page = 1;

  private columnHeaders = [
    {
      title: '節点番号',
      dataType: 'integer',
      dataIndx: 'nodeNum',
      sortable: false,
      width: 105,
    },
    {
      title: 'X',
      dataType: 'float',
      format: '#.000',
      dataIndx: 'X',
      sortable: false,
      width: 105,
      editable: false,
      style: { background: '#dae6f0' },
    },
    {
      title: 'Y',
      dataType: 'float',
      format: '#.000',
      dataIndx: 'y',
      sortable: false,
      width: 105,
      editable: false,
      style: { background: '#dae6f0' },
    },
  ];

  private ROWS_COUNT = 15;
  public inner_width = 300;
  constructor(
    private data: StranaService,
    private app: AppComponent,
    private three: ThreeService
  ) {}

  ngOnInit(): void {
    this.ROWS_COUNT = this.rowsCount();
    this.loadPage(1, this.ROWS_COUNT);
    const load_name = this.data.getSoilColumns(1);
    this.strana_name = load_name.name;
    // this.three.ChangeMode("strana");
    // this.three.ChangePage(1);
  }

  // 　pager.component からの通知を受け取る
  onReceiveEventFromChild(eventData: number) {
    this.dataset.splice(0);
    this.loadPage(eventData, this.ROWS_COUNT);
    this.grid.refreshDataAndView();
    const strana_name = this.data.getSoilColumns(eventData);
    this.strana_name = strana_name.name;
    this.three.ChangePage(eventData);
  }

  loadPage(currentPage: number, row: number) {
    for (let i = this.dataset.length + 1; i <= row; i++) {
      const fix_node = this.data.getStranaColumns(currentPage, i);
      this.dataset.push(fix_node);
    }
    this.page = currentPage;
  }

  // 表の高さを計算する
  private tableHeight(): string {
    const containerHeight = this.app.getDialogHeight() - 70; // pagerの分減じる
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
    locale: 'jp',
    height: this.tableHeight(),
    numberCell: {
      show: true, // 行番号
      width: 45,
    },
    colModel: this.columnHeaders,
    animModel: {
      on: true,
    },
    dataModel: {
      data: this.dataset,
    },
    beforeTableView: (evt, ui) => {
      const finalV = ui.finalV;
      const dataV = this.dataset.length;
      if (ui.initV == null) {
        return;
      }
      if (finalV >= dataV - 1) {
        this.loadPage(this.page, dataV + this.ROWS_COUNT);
        this.grid.refreshDataAndView();
      }
    },
    selectEnd: (evt, ui) => {
      const range = ui.selection.iCells.ranges;
      const row = range[0].r1 + 1;
      const column = range[0].c1;
      this.three.selectChange('strana', row, column);
    },
    change: (evt, ui) => {
      for (const range of ui.updateList) {
        const row = range.rowIndx + 1;
        this.three.changeData('strana', row);
      }
      //ここで地表面の1次式を導入する
      this.three.getGroundLinear();
    },
  };

  width = 450;
}
