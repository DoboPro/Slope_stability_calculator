import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThreeComponent } from './components/three/three.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MenuComponent } from './components/menu/menu.component';
import { WaitDialogComponent } from './components/wait-dialog/wait-dialog.component';
import { NodeComponent } from './components/input/node/node.component';
import { StranaComponent } from './components/input/strana/strana.component';
import { SoilComponent } from './components/input/strana/soil.component';
import { WaterlevelComponent } from './components/input/waterlevel/waterlevel.component';
import { LoadComponent } from './components/input/load/load.component';
import { InitialConditionComponent } from './components/input/initial-condition/initial-condition.component';
import { SheetComponent } from './components/input/sheet/sheet.component';
import { PagerComponent } from './components/input/pager/pager.component';
import { SafetyRatioComponent } from './components/result/safety-ratio/safety-ratio.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeComponent,
    MenuComponent,
    WaitDialogComponent,
    NodeComponent,
    StranaComponent,
    WaterlevelComponent,
    LoadComponent,
    InitialConditionComponent,
    SoilComponent,
    SheetComponent,
    PagerComponent,
    SafetyRatioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatSelectModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    // CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
