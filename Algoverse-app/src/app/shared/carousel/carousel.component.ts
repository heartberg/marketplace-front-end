import { Component, OnInit } from '@angular/core';
import SwiperCore, {
  Navigation,
  Pagination
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
export class CarouselComponent implements OnInit {

  config = {
    centeredSlides: true,
    loopAdditionalSlides: 50,
    //autoHeight: true,
    slidesPerView: 1.16,
    spaceBetween: 10,
    pagination: false,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1440: {
        slidesPerView: 1.74,
        spaceBetween: 30,
      },
      1560: {
        slidesPerView: 1.875,
        spaceBetween: 30,
      }
    },
    /*pagination: {
      clickable: true,
      el: '#heroSwiper',
      //type: 'custom',
      bulletClass: "swiper-bullet-custom",
      bulletActiveClass: "swiper-bullet-custom-active",
      renderBullet: (i, className) => {
        return `<div class="${className} _x_cursor-pointer _x_mx-3 md:_x_mx-6 _x_w-8 _x_min-w-8 _x_h-8 _x_group _x_border-2 hover:_x_border-purple _x_transition _x_duration-300 _x_rounded-full _x_flex _x_justify-center _x_items-center  ${i + 1 === this.currentPage ? '_x_border-purple' : '_x_border-transparent'}"><i class="_x_w-3 _x_h-3 _x_rounded-8 group-hover:_x_bg-purple _x_transition _x_duration-300 ${i + 1 === this.currentPage ? '_x_bg-purple' : '_x_bg-dark-300'}"></i></div>`
      },
      renderCustom: (swiper, current, total) => {
/!*
        this.subject.next({swiper, current, total})
        return this.pagination.nativeElement.innerHTML;
*!/
        const bulletClick = () => {
        }
        return `
        <div class='_x_flex _x_justify-center'>
          ${this.sliderImages.map((item, i) => {
          return `<div onclick='${bulletClick}' class="swiper-pagination-clickable _x_cursor-pointer _x_mx-3 md:_x_mx-6 _x_w-8 _x_min-w-8 _x_h-8 _x_group _x_border-2 hover:_x_border-purple _x_transition _x_duration-300 _x_rounded-full _x_flex _x_justify-center _x_items-center  ${i + 1 === current ? '_x_border-purple' : '_x_border-transparent'}"><i class="_x_w-3 _x_h-3 _x_rounded-8 group-hover:_x_bg-purple _x_transition _x_duration-300 ${i + 1 === current ? '_x_bg-purple' : '_x_bg-dark-300'}"></i></div>`
        }).join('')}
        </div>
      `;
      }
    },*/
    navigation: {
      nextEl: '#heroRight',
      prevEl: '#heroLeft'
    },
    loop: true,
    autoplay: {
      delay: 10000
    }
  };
  constructor() { }

  ngOnInit(): void {
  }

  onSwiper($event: any) {

  }

  onSlideChange() {

  }

  slideNext() {

  }

  slidePrev() {

  }
}
