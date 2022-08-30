import { Component } from '@angular/core';
import { SocialMedia } from '../../../models';
import { socialMediaLinks } from '../../../constants';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent {
  public socialMedia: SocialMedia[] = socialMediaLinks;

  constructor() { }
}
