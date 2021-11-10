import {NgModule} from "@angular/core";
import {ArtistApplicationComponent} from "./artist-application/artist-application.component";
import {ArtistsComponent} from "./artists/artists.component";
import {SpaceshuttleComponent} from "./spaceshuttle/spaceshuttle.component";
import {SharedModule} from "../../shared/shared.module";
import {CarouselModule} from "../../carousel/carousel.module";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations:[
    ArtistApplicationComponent,
    ArtistsComponent,
    SpaceshuttleComponent
  ],
  imports: [
    SharedModule,
    CarouselModule,
    CommonModule,
    BrowserModule
  ],
  providers: [

  ],
  exports: [

  ]
})

export class ArtistsModule {

}
