import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { WalletsConnectService } from 'src/app/services/wallets-connect.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileTitle: string = 'Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM Message text LOREM IPSUM '
  profileImg: string = 'https://www.annualreviews.org/pb-assets/journal-home/special-collections/collection-archive-extreme-weather-2021-1630444709857.png'
  public exampleArr:number[] = [1,2];
  userProfile: any;
  userCollections: any;

  constructor(
    private userService: UserService,
    private connectService: WalletsConnectService
  ) { }

  ngOnInit(): void {
    let wallet = this.connectService.sessionWallet
    if(wallet) {
      let addr = wallet.getDefaultAccount()
      this.userService.loadProfile(addr).subscribe(
        (res: any) => {
          this.userProfile = res
          console.log(this.userProfile)
          this.userService.loadCollections(addr).subscribe(
            (collections: any) => {
              this.userCollections = collections
            }
          )
        }
      )
    }
  }

}
