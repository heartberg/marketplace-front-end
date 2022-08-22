import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MarketplaceTypeEnum} from "../../models";
import {interval, Subscription} from "rxjs";
import moment from 'moment';

@Component({
  selector: 'app-updated-card',
  templateUrl: './updated-card.component.html',
  styleUrls: ['./updated-card.component.scss']
})
export class UpdatedCardComponent implements OnInit, OnDestroy {

  @Input() public item: any;
  @Input() public type: MarketplaceTypeEnum = MarketplaceTypeEnum.ALL;

  public marketplaceTypes: typeof MarketplaceTypeEnum = MarketplaceTypeEnum;
  public auctionCountdown: string = "00:00:00";
  public highestBid: number = 0;

  private $subscription: Subscription = new Subscription();
  private timeDiff: moment.Duration = moment.duration();

  constructor() { }

  ngOnInit(): void {
    if (this.type === this.marketplaceTypes.AUCTION && this.item.bids.length) {
      this.findForHighestBid();
    }
    if (this.type === MarketplaceTypeEnum.AUCTION && this.item.isOpen) {
      this.timeDiff = moment.duration(moment(moment.unix(this.item.closingDate)).diff(moment()));
      this.$subscription = interval(1000).subscribe(() => this.startCountdown());
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  private startCountdown(): void {
    this.timeDiff.subtract(1, 'second');
    this.auctionCountdown =  [Math.floor(this.timeDiff.asHours()), this.timeDiff.minutes(), this.timeDiff.seconds()].join(':');
  }

  private findForHighestBid(): void {
    this.highestBid = Math.max(...this.item.bids.map((bid: any) => bid.amount));
  }
}
