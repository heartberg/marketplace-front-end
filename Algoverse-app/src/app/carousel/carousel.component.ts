import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  @Input() sliderImgs: any[] = [];
  public title = 'owlcarouselinAngular';

  SlideOptions = {
    items: 1,
    dots: true,
    nav: true,
    loop: true,
    margin: 15,
    autoplaySpeed: true,
    // responsive : {
    //   0:{
    //     items:1,
    //     nav:true
    //   },
    //   600:{
    //     items:2,
    //     nav:false
    //   },
    //   1000:{
    //     items:1,
    //     nav:true,
    //     loop:false
    //   }
    // }
  };
  CarouselOptions = {
    items: 3,
    dots: true,
    nav: true
  };
}
