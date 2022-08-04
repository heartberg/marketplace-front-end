import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public $colorTheme: BehaviorSubject<string> = new BehaviorSubject<string>('light');

  constructor() { }

  get themeColor(): string {
    return this.$colorTheme.value;
  }

  public setColorTheme(theme: string): void {
    this.$colorTheme.next(theme);
    localStorage.setItem('user-theme', theme);
  }

  public getColorTheme(): void {
    if (localStorage.getItem('user-theme')) {
      this.$colorTheme.next(localStorage.getItem('user-theme') as string)
    } else {
      localStorage.setItem('user-theme', this.themeColor);
    }
  }
}
