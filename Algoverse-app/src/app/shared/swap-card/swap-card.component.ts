import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-swap-card',
  templateUrl: './swap-card.component.html',
  styleUrls: ['./swap-card.component.scss']
})
export class SwapCardComponent implements OnInit {
  sliderImgs = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCIpwPBaVYiXVLl_gTRHBWJPkkjp5JdeBqGQ&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCIpwPBaVYiXVLl_gTRHBWJPkkjp5JdeBqGQ&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCIpwPBaVYiXVLl_gTRHBWJPkkjp5JdeBqGQ&usqp=CAU',  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCIpwPBaVYiXVLl_gTRHBWJPkkjp5JdeBqGQ&usqp=CAU']
  constructor() { }

  ngOnInit(): void {
  }
}
