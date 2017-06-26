import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs/Rx';
import { UserApi } from '../../fw/userApi/user-api';
import { User } from '../models/User';
import { MainAuthService } from './main-auth.service';
import { tokenNotExpired } from 'angular2-jwt';
import { Subject }    from 'rxjs/Subject';
import { AppSetting } from '../config/app.config';


@Injectable()
export class UserService implements UserApi {

  // isAuthenticated: boolean = false; 
  public currentUser : User = new User();
  loginObs$ : any;
  socialObs$ : Observable<any>;
  registerObs$ : Observable<any>;
	authToken: any;
	profileImage: string;
  loggedIn: boolean = false;
  
  constructor(
      private router: Router,
      private mainAuthService: MainAuthService
  ) { }

  localLogin(email: string, password: string):any {
    console.log('UserService.signIn: ' + email + ' ' + password);
    let user ={
        email: email,
        password: password
    };
		// let authenticated = false;
    console.log("Signing user: ", email, ', ' , password);
    let loginObs$ = this.mainAuthService.loginUser(user);
    console.log("from cacheable: ", loginObs$);
    	loginObs$.subscribe(data => {
        console.log("DATA from node via cacheable for login: ", data);
        console.log("success: ", data.success );
        if (data.success){
						// this.serverData = data;
            console.log("data.body.user:", data.user);
            console.log("data.body.token:", data.token);
            this.storeUserData(data.user, data.token); 
            console.log("USER: ", data.user);
            // authenticated = true;
						console.log("you are sucessfully logged in: ", data);
        }else{
          this.mainAuthService.cache$ = null;
        }
    });
    return loginObs$;
  }
















  socialLogin( email: string, uid: string, name: string, provider: string, image: string ) : Observable<any> {
    console.log('UserService.socialLogin: ' + email + ' ' + name + ' ' + provider);
    let user = {
        email: email,
        uid: uid,
        name: name,
        provider: provider,
        image: image
    };
		// let authenticated: boolean = false;
    // this returns observable so we subscribe to it
    let socialObs$ = this.mainAuthService.socialLoginUser(user);
    socialObs$.subscribe((data) => {
        // console.log(data);
        if (data.success){
						// this.serverData = data;
            this.storeUserData(data.user, data.token);
            console.log("current User: ", this.currentUser);
						// authenticated = true;
        }
    }); 
    return socialObs$; 
  }

  register( firstname: string, lastname: string, email: string, password: string): Observable<any>{
    console.log('UserService.register: ' + email + ' ' + password);
    let user = {
        firstname: firstname,
				lastname: lastname,
				email: email,
        password: password
    };
    let registerObs$ = this.mainAuthService.registerUser(user);
    return registerObs$;
  } 
 



  logout(): Observable<any> {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.clear();    
      this.router.navigate(['/services']);
      return Observable.of({});
  }

  getProfile(){
		let token = this.loadToken();
    this.mainAuthService.getProfile(token)
      .subscribe(data => {
				this.storeUserData(data.user, token);
        console.log("profile get from profile method: ", data);
        console.log("profile written to currentUser: ", this.currentUser);
    });

  }

	getImageURL(): string{
		return this.profileImage = 
			this.currentUser.imageURL ? this.currentUser.imageURL : AppSetting.defaultProfileImage;
	}

  isLoggedIn(): boolean{
    return tokenNotExpired('id_token');
  }

	loadToken(): string{
		// const token = localStorage.getItem('id_token');
		// this.authToken = token;
		return localStorage.getItem('id_token');
	}

	storeUserData(user, token){
		localStorage.setItem('user', JSON.stringify(user));
		localStorage.setItem('id_token', token);
		this.currentUser = user;
		this.authToken = token;
	}




}
