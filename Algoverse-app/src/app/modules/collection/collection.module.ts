import {NgModule} from "@angular/core";
import {CollectionDetailComponent} from "./collection-detail/collection-detail.component";
import {CreateCollectionComponent} from "./create-collection/create-collection.component";
import {MyCollectionComponent} from "./my-collection/my-collection.component";
import {UpdateCollectionComponent} from "./update-collection/update-collection.component";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations:[
    CollectionDetailComponent,
    CreateCollectionComponent,
    MyCollectionComponent,
    UpdateCollectionComponent,
  ],
    imports: [
        SharedModule,
        CommonModule,
        BrowserModule,
        RouterModule,
        ReactiveFormsModule
    ],
  providers: [

  ],
  exports: [

  ]
})

export class CollectionModule {

}
