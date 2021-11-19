import { NgModule } from "@angular/core";
import { CollectionDetailComponent } from "./collection-detail/collection-detail.component";
import { CreateCollectionComponent } from "./create-collection/create-collection.component";
import { MyCollectionComponent } from "./my-collection/my-collection.component";
import { UpdateCollectionComponent } from "./update-collection/update-collection.component";
import { SharedModule } from "../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  { path: '', component: MyCollectionComponent },
  { path: 'create-collection', component: CreateCollectionComponent },
  { path: 'update-collection', component: UpdateCollectionComponent },
  { path: 'collectionId/:collectionId', component: CollectionDetailComponent },
]
@NgModule({
  declarations: [
    CollectionDetailComponent,
    CreateCollectionComponent,
    MyCollectionComponent,
    UpdateCollectionComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule,
    RouterModule
  ],
  providers: [

  ],
  exports: [

  ]
})

export class CollectionModule {

}
