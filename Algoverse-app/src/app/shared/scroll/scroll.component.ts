import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Mousewheel, SwiperOptions} from "swiper";
import SwiperCore from 'swiper';

SwiperCore.use([Mousewheel])

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss']
})
export class ScrollComponent {
  public defaultImageSource: string = "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
  @Input() public scrollItems: any[] = [];
  @Output() public openArtistProfile: EventEmitter<string> = new EventEmitter<string>();

  public config: SwiperOptions = {
    spaceBetween: 8,
    slidesPerView: 1,
    mousewheel: {
      sensitivity: 1,
      releaseOnEdges: true
    },
    on: {},
    breakpoints: {
      769: {
        slidesPerView: 4
      },
      575: {
        slidesPerView: 2
      }
    }
  };


  constructor() { }

}
