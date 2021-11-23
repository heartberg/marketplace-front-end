import { NgModule } from "@angular/core";
import { ProfileComponent } from "./profile.component";
import { NotificationCentreComponent } from "./notification-centre/notification-centre.component";
import { ProfileEditComponent } from "./profile-edit/profile-edit.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { GetVerifiedComponent } from "./get-verified/get-verified.component";
import { SharedModule } from "../../shared/shared.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";


const routes: Routes = [
  { path: '', component: ProfileComponent, },
  { path: 'profile-settings', component: ProfileSettingsComponent },
  { path: 'notification-center', component: NotificationCentreComponent },
  { path: 'edit-profile', component: ProfileEditComponent },
  { path: 'get-verified', component: GetVerifiedComponent }
]
@NgModule({
  declarations: [
    ProfileComponent,
    NotificationCentreComponent,
    ProfileEditComponent,
    ProfileSettingsComponent,
    GetVerifiedComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatSlideToggleModule,
    MatTabsModule,
    CommonModule,
  ],
  providers: [

  ],
  exports: [

  ]
})

export class ProfileModule {

}
