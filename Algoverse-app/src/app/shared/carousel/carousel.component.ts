import { Component, OnInit } from '@angular/core';
import SwiperCore, {
  Navigation,
  Pagination, SwiperOptions
} from 'swiper';

SwiperCore.use([
  Navigation,
  Pagination
]);

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent{
  config: SwiperOptions = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    spaceBetween: 30
  };
}
