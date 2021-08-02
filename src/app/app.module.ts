import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThreeComponent } from './components/three/three.component';
import { MenuComponent } from "./components/menu/menu.component";
import { WaitDialogComponent } from './components/wait-dialog/wait-dialog.component';
import { SurfaceComponent } from './components/input/surface/surface.component';
import { StranaComponent } from './components/input/strana/strana.component';
import { WaterlevelComponent } from './components/input/waterlevel/waterlevel.component';
import { InitinalConditionComponent } from './components/input/initinal-condition/initinal-condition.component';
import { LoadComponent } from './components/input/load/load.component';
import { InitialConditionComponent } from './components/input/initial-condition/initial-condition.component';
import { SoilComponent } from './components/input/strana/soil/soil.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeComponent,
    MenuComponent,
    WaitDialogComponent,
    SurfaceComponent,
    StranaComponent,
    WaterlevelComponent,
    InitinalConditionComponent,
    LoadComponent,
    InitialConditionComponent,
    SoilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
