import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurfaceComponent } from './components/input/surface/surface.component';
import { StranaComponent } from './components/input/strana/strana.component';
import { SoilComponent } from './components/input/strana/soil.component';
import { WaterlevelComponent } from './components/input/waterlevel/waterlevel.component';
import { LoadComponent } from './components/input/load/load.component';
import { InitialConditionComponent } from './components/input/initial-condition/initial-condition.component';

const routes: Routes = [
  { path: 'initialCondition', component: InitialConditionComponent },
  { path: 'load', component: LoadComponent },
  { path: 'strana', component: StranaComponent },
  { path: 'soil', component: SoilComponent },
  { path: 'waterlevel', component: WaterlevelComponent },
  { path: 'surface', component: SurfaceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
