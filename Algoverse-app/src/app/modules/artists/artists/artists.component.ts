import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {
  public hotDropDown = ['1 Day', '7 Days', '30 Days', 'All Time',];
  public featuredArtists: any;
  public hotCreators: any;
  public allCreators: any;
  public lastDays: number = 1;
  public ordering = "followers"

  constructor(
    private _userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this._userService.loadFeaturedArtists().subscribe(
      result => {
        console.log('featured artists', result);
        this.featuredArtists = result;
      },
      err => {
        console.log(err);
      }
    );

    this.loadHotCreators();
    this.getAllUsers()
  }

  getAllUsers() {
    this._userService.loadAllUsers(this.ordering).subscribe(
      result => {
        console.log('all creators', result);
        this.allCreators = result;
      },
      err => {
        console.log(err);
      }
    );
  }

  selectedLastDuration(lastDays: string) {
    if (lastDays == 'All Time') {
      this.lastDays = 0;
    }
    else if (lastDays == '30 Days') {
      this.lastDays = 30;
    }
    else if (lastDays == '7 Days') {
      this.lastDays = 7;
    }
    else if (lastDays == '1 Days') {
      this.lastDays = 1;
    }

    this.loadHotCreators();
  }

  loadHotCreators(){
    this._userService.loadHotCreators(this.lastDays).subscribe(
      result => {
        console.log('hot creators', result);
        this.hotCreators = result;
      },
      err => {
        console.log(err);
      }
    )
  }

  public openArtistProfile(wallet: string): void {
    this.router.navigate([`/profile/${wallet}`]);
  }

  public selectedOrdering(event: string) {
    if(event == 'Alphabetical A-Z') {
      this.ordering = "alphabetical_a_z"
    } else if(event == 'Alphabetical Z-A') {
      this.ordering = "alphabetical_z_a"
    } else if(event == 'Followers') {
      this.ordering = "followers"
    } else {
      this.ordering = "followers"
    }
    this.getAllUsers()
  }
}
