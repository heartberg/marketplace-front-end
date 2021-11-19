import { NgModule } from "@angular/core";
import { ArtistApplicationComponent } from "./artist-application/artist-application.component";
import { ArtistsComponent } from "./artists/artists.component";
import { SpaceshuttleComponent } from "./spaceshuttle/spaceshuttle.component";
import { SharedModule } from "../../shared/shared.module";
import { CarouselModule } from "../../carousel/carousel.module";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  { path: '', component: ArtistsComponent },
  { path: 'artist-application', component: ArtistApplicationComponent },
  { path: 'space-shuttle', component: SpaceshuttleComponent }
]
@NgModule({
  declarations: [
    ArtistApplicationComponent,
    ArtistsComponent,
    SpaceshuttleComponent
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

export class ArtistsModule {

}
