import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileTitle: string = 'Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM '
  profileImg: string = 'https://www.annualreviews.org/pb-assets/journal-home/special-collections/collection-archive-extreme-weather-2021-1630444709857.png'
  public exampleArr:number[] = [1,2];

  constructor() { }

  ngOnInit(): void {
  }

}
