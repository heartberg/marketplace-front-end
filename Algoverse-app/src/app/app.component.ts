import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ThemeService} from "./services/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public appTheme: string = 'light';

  constructor(private route: ActivatedRoute, private readonly _themeService: ThemeService) {
    console.log(this.route.url);
  }

  ngOnInit(): void {
    this.receiveThemeColor();
  }

  private receiveThemeColor() {
    this._themeService.getColorTheme();
    this._themeService.$colorTheme.subscribe((theme: string) => {
      this.appTheme = theme;
    });
  }
}
