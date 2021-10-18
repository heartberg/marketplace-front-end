import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public hotDropDown = ['Collections', 'Item', 'Buyers', 'Sellers', 'Creators'];
  public hotInDropDown = ['1 Day', '7 Days', '30 Days', 'All Time',];

  constructor(private _userService: UserService) { }

  ngOnInit(): void {
    this._userService.userGetShuttle().subscribe(
      (result) => console.log(result)
    );
  }

}
