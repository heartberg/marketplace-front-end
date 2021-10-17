import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-centre',
  templateUrl: './notification-centre.component.html',
  styleUrls: ['./notification-centre.component.scss']
})
export class NotificationCentreComponent implements OnInit {
  arr: any[] = [1,2,3,4,5,6,6,7]
  constructor() { }

  ngOnInit(): void {
  }

}
