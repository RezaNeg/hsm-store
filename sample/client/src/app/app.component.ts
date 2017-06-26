import { Component } from '@angular/core';
import { FrameworkConfigService, FrameworkConfigSettings } from '../fw/services/framework-config.service';
import { AppSetting } from './config/app.config';
import { fadeInAnimation, slideInOutAnimation } from '../fw/animations/index.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ fadeInAnimation, slideInOutAnimation ]
})
export class AppComponent {


  constructor(private frameworkConfigService: FrameworkConfigService){

    frameworkConfigService.configure(AppSetting);
  }

}
