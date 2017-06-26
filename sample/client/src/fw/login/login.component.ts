import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Angular2SocialLoginModule } from "angular2-social-login";
import { FacebookService, LoginOptions, LoginResponse, InitParams } from 'ngx-facebook';

import { UserApi } from '../userApi/user-api';
import { FrameworkConfigService } from '../services/framework-config.service';
import { fadeInAnimation, slideInOutAnimation } from '../animations/index.animation';


@Component({
  selector: 'fw-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',
              '../../assets/vendor/bootstrap/css/bootstrap-social.css'
              ],
  animations: [ fadeInAnimation, slideInOutAnimation ]

})
export class LoginComponent implements OnInit {
  
  formError: string;
  submitting = false;
  

  constructor(
    private frameworkConfigService: FrameworkConfigService,
    private userApi: UserApi,
    private router: Router,
    private socialAuth: AuthService,
    private fb: FacebookService
  ) { 
      this.frameworkConfigService.showUserControls = false;
      this.frameworkConfigService.showNavbar = false;
  }

  ngOnInit() {
  }

  onLoginSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      console.log('submitting...', loginForm);
      this.submitting = true;
      this.formError = null;

      this.userApi.localLogin(loginForm.value.email, loginForm.value.password)
        .subscribe((data) => {

          console.log("Data BODY back from server: ", data);
          if (data.success){
            this.frameworkConfigService.showUserControls= true;
            this.frameworkConfigService.showNavbar=true;
            this.router.navigate(['/profile']);
          }else{
            this.submitting = false;
            this.formError = data.msg;
            setTimeout(()=>{ this.formError = ""}, 2000);
            this.router.navigate(['/login']);
          }        
        },
        (err)=> {
          this.submitting = false;
          console.log('got error: ', err);
          this.formError = err;
        }
      );
    }
  }

  onFacebookAuth(){
   	let fbInitParams: InitParams = {
      appId: this.frameworkConfigService.providers.facebook.clientId,
      xfbml: this.frameworkConfigService.providers.facebook.xfbml,
      version: this.frameworkConfigService.providers.facebook.apiVersion
    };
		this.fb.init(fbInitParams);

		const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,email' 
    };

		this.fb.login(loginOptions)
      .then((response: LoginResponse) => {
				console.log(response);
				if (response.status === "connected"){
					this.fb.api('/me?fields=email,name,picture')
						.then((user: any) => {
							console.log("User profile from facebook api:", user);
              this.userApi.socialLogin( user.email,
                                        user.id,
                                        user.name,
                                        "facebook",
                                        user.picture.data.url )
                .subscribe((data) => {
                  console.log("Data back from server to framework: ", data);
                  if (data.success){
                    this.frameworkConfigService.showUserControls= true;
                    this.frameworkConfigService.showNavbar=true;
                    this.router.navigate(['/profile']);
                  }else{
                    this.submitting = false;
                    this.formError = data.msg;
                    setTimeout(()=>{ this.formError = ""}, 2000);
                    this.router.navigate(['/login']);
                  }        
                },
                (err)=> {
                  this.submitting = false;
                  console.log('social login error: ', err);
                  this.formError = err;
                  setTimeout(()=>{ this.formError = ""}, 2000);
                })
            })
						.catch((error: any) => console.error("Error in getting Facebook profile: ", error));
				}else{
					console.log("NOT CONNECTED!");
				}
			})
      .catch((error: any) => console.error("Facebook login error: ", error));		
	}


  onSocialLogin(provider){
    this.socialAuth.login(provider).subscribe(
      (profile) => {
          if (!profile){
            this.formError = "Error in fetching data from social network!";
            setTimeout(()=>{ this.formError = ""}, 2000);
          }else{
            this.submitting = true;
            console.log("your auth user profile consists of: ", profile);
            this.userApi.socialLogin( profile['email'],
                                      profile['uid'],
                                      profile['name'],
                                      profile['provider'],
                                      profile['image'] )
              .subscribe((data) => {
                console.log("Data back from server to framework: ", data);
                if (data.success){
                  this.frameworkConfigService.showUserControls= true;
                  this.frameworkConfigService.showNavbar=true;
                  this.router.navigate(['/profile']);
                }else{
                  this.submitting = false;
                  this.formError = data.msg;
                  setTimeout(()=>{ this.formError = ""}, 2000);
                  this.router.navigate(['/login']);
                }        
              },
              (err)=> {
                this.submitting = false;
                console.log('got error: ', err);
                this.formError = err;
                setTimeout(()=>{ this.formError = ""}, 2000);
              }
      );
    }
  })
  }  

}
