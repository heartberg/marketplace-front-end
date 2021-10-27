import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OwlModule} from "ngx-owl-carousel";
import {CarouselComponent} from "./carousel.component";

@NgModule({
  declarations: [
    CarouselComponent,
  ],
  imports: [
    CommonModule,
    OwlModule,
  ],
  exports: [
    CarouselComponent
  ]
})
export class CarouselModule { }
