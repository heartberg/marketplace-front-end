import {NgModule} from "@angular/core";
import {ProfileComponent} from "./profile.component";
import {NotificationCentreComponent} from "./notification-centre/notification-centre.component";
import {ProfileEditComponent} from "./profile-edit/profile-edit.component";
import {ProfileSettingsComponent} from "./profile-settings/profile-settings.component";
import {GetVerifiedComponent} from "./get-verified/get-verified.component";
import {SharedModule} from "../../shared/shared.module";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTabsModule} from "@angular/material/tabs";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations:[
    ProfileComponent,
    NotificationCentreComponent,
    ProfileEditComponent,
    ProfileSettingsComponent,
    GetVerifiedComponent
  ],
  imports: [
    SharedModule,
    MatSlideToggleModule,
    MatTabsModule,
    CommonModule,
    BrowserModule
  ],
  providers: [

  ],
  exports: [

  ]
})

export class ProfileModule {

}
