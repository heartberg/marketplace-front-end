import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WhitelistService {

  public $isWhitelisted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  set isWhitelistedValue(isWhitelisted: boolean) {
    this.$isWhitelisted.next(isWhitelisted);
  }

}
