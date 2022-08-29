import { Component, OnInit } from '@angular/core';
import {WalletsConnectService} from "../../../services/wallets-connect.service";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {WhitelistService} from "../../../services/whitelist.service";

@Component({
  selector: 'app-access-connect',
  templateUrl: './access-connect.component.html',
  styleUrls: ['./access-connect.component.scss']
})
export class AccessConnectComponent implements OnInit {
  public isWhitelisted: boolean = true;
  private wallet: string[] = [];

  constructor(
    private readonly walletsConnectService: WalletsConnectService,
    private readonly userService: UserService,
    private readonly router: Router,
    private whitelistService: WhitelistService
  ) {
  }

  ngOnInit(): void {
    if (this.walletsConnectService.myAlgoAddress && this.walletsConnectService.myAlgoAddress[0]) {
      this.userService.checkAddressInWhitelist(this.walletsConnectService.myAlgoAddress[0]).subscribe((isWhitelisted: boolean) => {
        this.isWhitelisted = isWhitelisted;
        this.whitelistService.isWhitelistedValue = isWhitelisted;
        if (isWhitelisted) {
          this.router.navigate(['/marketplace']);
        }
      })
    }
  }

  public async connectWallet(): Promise<void> {
    this.walletsConnectService.connect("my-algo-connect", true).then(() => {
      this.wallet = this.walletsConnectService.myAlgoAddress;
      this.userService.checkAddressInWhitelist(this.wallet[0]).subscribe((isWhitelisted: boolean) => {
        this.isWhitelisted = isWhitelisted;
        this.whitelistService.isWhitelistedValue = isWhitelisted;
        if (!isWhitelisted) {
          this.walletsConnectService.disconnect(true);
        }
        if (isWhitelisted) {
          this.router.navigate(['/marketplace']);
        }
      })
    });
  }
}
