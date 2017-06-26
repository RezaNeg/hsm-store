import { Injectable } from '@angular/core';

export interface IconFiles {
    imageFile: string,
    alt: string,
    link: string
}

export interface SocialLogins {
    title: string,
    imageFile: string,
    alt: string
}


export interface FrameworkConfigSettings {
    showLanguageSelector?: boolean,
    showUserControls?: boolean,
    showStatusBar?: boolean,
    showNavbar?: boolean,
    socialIcons?: Array<IconFiles>,
    socialLogins?: Array<SocialLogins>,
    backgroundImageURL?: string,
    logo?: string,
    defaultProfileImage?: string;
    providers?: object,
    profileDetails: Array<string>

}



@Injectable()
export class FrameworkConfigService {

  showLanguageSelector = true;
  showUserControls = false;
  showStatusBar = true;
  showNavbar = true;
  socialIcons = new Array<IconFiles>();
  socialLogins = new Array<SocialLogins>();
  backgroundImageURL = "../../assets/img/hotsauceBG.jpg";
  logo = "../../assets/img/LogoSentence_Yellow30px.png";
  defaultProfileImage = "../../assets/img/defaultProfileImage.png";
  providers = {
    "google": {
      "clientId": "664615459793-6h8arfmmgf5llhb8utbjq72h6gust3ht.apps.googleusercontent.com"
    },
    "facebook": {
      "clientId": "1880556825493098",
      "apiVersion": "v2.9",
      "xfbml": true
    },
    "linkedin": {
      "clientId": "778ojmtkko2o7b"
    }
  };
  profileDetails:["LOCAL", "FACEBOOK", "GOOGLE", "LINKEDIN"];

  configure(settings: FrameworkConfigSettings) : void {
      Object.assign(this, settings);
  }
}
