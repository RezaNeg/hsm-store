import { Component, OnInit, AfterViewChecked, Input, Output } from '@angular/core';
import { FlashMessagesService} from 'angular2-flash-messages';
import { fadeInAnimation, slideInOutAnimation } from '../../../fw/animations/index.animation';
import { Router, NavigationEnd} from '@angular/router';

import { MainAuthService } from '../../services/main-auth.service';
import { UserService } from '../../services/user.service';
import { FrameworkConfigService } from '../../../fw/services/framework-config.service';
import { AppSetting } from '../../config/app.config';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [ fadeInAnimation, slideInOutAnimation ]
})
export class ProfileComponent implements OnInit {
  items: any;

  constructor(
    private mainAuthService: MainAuthService,
    private userService: UserService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private frameworkConfigService: FrameworkConfigService
  ) { }

  ngOnInit() {
    if (this.userService.isLoggedIn()){
      // this.items = AppSetting.profileDetails;
      AppSetting.showNavbar = true;
      this.frameworkConfigService.showNavbar = true;
      this.frameworkConfigService.showUserControls = true;
      
      this.userService.getProfile();
      this.flashMessage.show("Welcome "+ this.userService.currentUser.firstname + "!", {cssClass: 'alert-info', timeout: 2000});
    }else{
      this.frameworkConfigService.showUserControls = false;
      this.frameworkConfigService.showNavbar = false;
      this.flashMessage.show("Your session is expired! Please login again.", {cssClass: 'alert-danger', timeout: 2000});
      this.router.navigate(['/login']); 
    }
  }


}
