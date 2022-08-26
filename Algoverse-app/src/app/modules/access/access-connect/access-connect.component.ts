import { Component, OnInit } from '@angular/core';
import {WalletsConnectService} from "../../../services/wallets-connect.service";

@Component({
  selector: 'app-access-connect',
  templateUrl: './access-connect.component.html',
  styleUrls: ['./access-connect.component.scss']
})
export class AccessConnectComponent implements OnInit {
  public isWhiteListed: boolean = true;
  private wallet: string[] = [];

  constructor(private readonly walletsConnectService: WalletsConnectService) { }

  ngOnInit(): void {
  }

  public async connectWallet(): Promise<void> {
    this.walletsConnectService.connect("my-algo-connect", true).then(res => {
      this.wallet = this.walletsConnectService.myAlgoAddress;
    });
  }
}
