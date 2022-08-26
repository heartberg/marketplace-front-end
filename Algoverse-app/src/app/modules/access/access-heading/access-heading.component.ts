import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";

@Component({
  selector: 'app-access-heading',
  templateUrl: './access-heading.component.html',
  styleUrls: ['./access-heading.component.scss']
})
export class AccessHeadingComponent implements OnInit {

  public isHeadingWrapped: boolean = false;

  constructor(private readonly breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      "(max-width: 768px)"
    ]).subscribe((result: BreakpointState) => {
      this.isHeadingWrapped = result.matches;
    });

  }

}
