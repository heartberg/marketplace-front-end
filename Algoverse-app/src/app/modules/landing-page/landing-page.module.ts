import { NgModule } from "@angular/core";
import { LandingPageComponent } from "./component/landing-page.component";
import { SharedModule } from "../../shared/shared.module";
import { CarouselModule } from "../../carousel/carousel.module";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' }
]
@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CarouselModule,
    CommonModule
  ],
  providers: [

  ],
  exports: [

  ]
})

export class LandingPageModule {

}
