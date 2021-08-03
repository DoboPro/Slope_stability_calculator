import { Component, OnInit,ViewChild } from '@angular/core';
import { Routes, RouterModule,CanActivate } from '@angular/router';
// import { InputStranaService } from "./input-load.service";
import { DataHelperModule } from "../../../providers/data-helper.module";
import { ThreeService } from "../../three/three.service";
import { SheetComponent } from "../sheet/sheet.component";
import pq from "pqgrid";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: 'app-strana',
  templateUrl: './strana.component.html',
  styleUrls: ['./strana.component.scss']
})
export class StranaComponent implements OnInit {
  @ViewChild("grid") grid: SheetComponent;

  public load_name: string;
  private dataset = [];
  constructor() { }

  ngOnInit(): void {
  }

    //　pager.component からの通知を受け取る
    // onReceiveEventFromChild(eventData: number) {
    //   this.dataset.splice(0);
    //   this.loadPage(eventData, this.ROWS_COUNT);
    //   this.grid.refreshDataAndView();
    //   const soil_name = this.data.getLoadNameColumns(eventData);
    //   this.soil_name = soil_name.name;
    //   this.three.ChangePage(eventData);
    // }
  

}
