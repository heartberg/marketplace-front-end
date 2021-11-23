import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {MatSliderModule} from "@angular/material/slider";
import {MatGridListModule} from "@angular/material/grid-list";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTreeModule} from "@angular/material/tree";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {CarouselModule} from "../carousel/carousel.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChartsModule, WavesModule} from "angular-bootstrap-md";
import {ArtistsModule} from "./artists/artists.module";
import {CollectionModule} from "./collection/collection.module";
import {CreateModule} from "./create/create.module";
import {LandingPageModule} from "./landing-page/landing-page.module";
import {MarketplaceModule} from "./market-place/marketplace.module";
import {ProfileModule} from "./profile/profile.module";
import {TokenModule} from "./token/token.module";

@NgModule({
  declarations: [

  ],
  imports: [
    MatSliderModule,
    MatGridListModule,
    RouterModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    // CarouselModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    WavesModule,
    ArtistsModule,
    CollectionModule,
    CreateModule,
    LandingPageModule,
    MarketplaceModule,
    ProfileModule,
    TokenModule
  ],
  providers: [],
  exports: [
  ]
})

export class HomeModule { }
