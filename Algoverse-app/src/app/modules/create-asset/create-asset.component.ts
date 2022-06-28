import { Component, OnInit } from '@angular/core';
import { IpfsDaemonService } from 'src/app/services/ipfs-daemon.service';

@Component({
  selector: 'app-create-asset',
  templateUrl: './create-asset.component.html',
  styleUrls: ['./create-asset.component.scss']
})
export class CreateAssetComponent implements OnInit {
  public pushedItems: any[] = [1];
  public toggleCounter: number = 1;
  constructor(
    private ipfsDaemonService: IpfsDaemonService
  ) { }

  ngOnInit(): void {
  }

  addSection() {
    this.pushedItems.push(1);
  }

  minus() {
    this.pushedItems.pop();
  }

  toggleEvent() {
    this.toggleCounter ++;
    if (this.toggleCounter % 2 === 0) {

    }
  }



}
