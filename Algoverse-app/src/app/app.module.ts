import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from "./shared/shared.module";
import {HomeModule} from "./modules/home.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
// import {OwlModule} from "ngx-owl-carousel";
import {CarouselModule} from "./carousel/carousel.module";
// import { CarouselComponent } from './carousel/carousel.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    AppComponent,
    // CarouselComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    BrowserAnimationsModule,
    CarouselModule,
    FormsModule,
    NgxSpinnerModule
    // OwlModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  exports: [NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
