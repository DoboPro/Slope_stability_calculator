import { Component, OnInit, ViewChild } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';
import { ThreeService } from '../../three/three.service';
import { AppComponent } from 'src/app/app.component';
import { LoadService } from './load.service';
import { InitialConditionService } from '../initial-condition/initial-condition.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit {
  @ViewChild('grid') grid: SheetComponent;

  private dataset = [];

  private columnHeaders = [
    {
      title: '始点X',
      dataType: 'float',
      format: '#.000',
      dataIndx: 'x_s',
      sortable: false,
      width: 90,
    },
    {
      title: '終点X',
      dataType: 'float',
      format: '#.000',
      dataIndx: 'x_d',
      sortable: false,
      width: 90,
    },
    {
      title: '荷重量',
      dataType: 'float',
      format: '#.000',
      dataIndx: 'loadAmount',
      sortable: false,
      width: 90,
    },
  ];

  private ROWS_COUNT = 15;
  public inner_width = 290;

  constructor(
    private data: LoadService,
    private app: AppComponent,
    private three: ThreeService,
    public init: InitialConditionService
  ) {}

  ngOnInit(): void {
    this.ROWS_COUNT = this.rowsCount();
    // three.js にモードの変更を通知する
    // this.three.ChangeMode("node");
  }

  // 指定行row 以降のデータを読み取る
  private loadData(row: number): void {
    for (let i = this.dataset.length + 1; i <= row; i++) {
      const load = this.data.getLoadColumns(i);
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
        this.loadData(dataV + this.ROWS_COUNT);
        this.grid.refreshDataAndView();
      }
    },
    selectEnd: (evt, ui) => {
      const range = ui.selection.iCells.ranges;
      const row = range[0].r1 + 1;
      const column = range[0].c1;
      this.three.selectChange('load', row, column);
    },
    change: (evt, ui) => {
      this.three.changeData('load');
    },
  };

  width = 370;
}
