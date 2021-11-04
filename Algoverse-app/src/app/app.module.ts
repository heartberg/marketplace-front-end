import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from "./shared/shared.module";
import {HomeModule} from "./modules/home.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
// import {OwlModule} from "ngx-owl-carousel";
import {CarouselModule} from "./carousel/carousel.module";
import {ReactiveFormsModule} from "@angular/forms";

// import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    // CarouselComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HomeModule,
    BrowserAnimationsModule,
    CarouselModule,
    // OwlModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
