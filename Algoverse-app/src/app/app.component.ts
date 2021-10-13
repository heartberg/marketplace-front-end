import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isThemeChanged: boolean = false;

  constructor(private route: ActivatedRoute) {
    console.log(this.route.url);
  }

  changeTheme(value: any) {
   this.isThemeChanged = value;
   return this.isThemeChanged;
  }


}
