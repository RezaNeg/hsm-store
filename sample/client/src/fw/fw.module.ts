import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angular2SocialLoginModule, AuthService } from "angular2-social-login";
import { FacebookModule, FacebookService } from 'ngx-facebook';


import { FrameworkBodyComponent } from './framework-body/framework-body.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

import { FrameworkConfigService } from './services/framework-config.service';
import { ScreenService } from './services/screen.service';
import { ValidationService } from './services/validation.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FlashMessagesModule,
    BrowserAnimationsModule, 
    Angular2SocialLoginModule,
    FacebookModule

  ],
  declarations: [
    FrameworkBodyComponent,
    NavbarComponent,
    ContentComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent

  ],
  providers:[
    FrameworkConfigService,
    ScreenService,
    ValidationService,
    AuthService,
    FacebookService
  ],
  exports: [
    FrameworkBodyComponent
  ]
})
export class FwModule { 
  constructor(frameworkConfigService: FrameworkConfigService) {
      Angular2SocialLoginModule.loadProvidersScripts(frameworkConfigService.providers);
      
  }
}
