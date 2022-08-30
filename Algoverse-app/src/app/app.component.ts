import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {ThemeService} from "./services/theme.service";
import {WhitelistService} from "./services/whitelist.service";
import {RouterService} from "./services/router.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public appTheme: string = 'light';
  public isWhitelisted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private readonly _themeService: ThemeService,
    private readonly whitelistService: WhitelistService,
    private readonly router: Router
  ) {
    console.log(this.route.url);
  }

  ngOnInit(): void {
    this.receiveThemeColor();
    this.whitelistService.$isWhitelisted.subscribe((isWhitelisted: boolean) => {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isWhitelisted = isWhitelisted;
        }
      })
    })
  }

  private receiveThemeColor() {
    this._themeService.getColorTheme();
    this._themeService.$colorTheme.subscribe((theme: string) => {
      this.appTheme = theme;
    });
  }
}
