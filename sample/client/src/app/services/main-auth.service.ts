import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../models/user';
import { cacheable } from './cacheable';


@Injectable()

export class MainAuthService {

	private observable: Observable<any>;
	
	constructor(
		private http: Http
	) { }
	
	registerUser(user){
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://localhost:3000/users/signup', user, {headers: headers})
			.map(res => res.json());
	}


	// normal login (two observable calls and two time processes on server side!)
	// loginUser(user){
	// 	let headers = new Headers();
	// 	headers.append('Content-Type', 'application/json');
	// 	return this.http.post('http://localhost:3000/users/login', user, {headers: headers})
	// 		.map(res => res.json());
	// }


//  Solution 1: login with one time call or no call from server side
//  if there is an error in authentication we have to clear cache data to be able to continue without problem
// 	loginUser(user) {
//     if(this.serverData!=null) {
// 		console.log("exisiting serverData: ", this.serverData);
//       // if `data` is available just return it as `Observable`
//       return Observable.of(this.serverData); 
//     } else if(this.observable) {
// 		console.log("exisiting observable: ", this.observable);

//       // if `this.observable` is set then the request is in progress
//       // return the `Observable` for the ongoing request
//       return this.observable;
//     } else {
// 		console.log("not chache data, trying to make http req!");
//       // example header (not necessary)
//       let headers = new Headers();
//       headers.append('Content-Type', 'application/json');
//       // create the request, store the `Observable` for subsequent subscribers
//       this.observable = this.http.post('http://localhost:3000/users/login', user, {headers: headers})
//       	.map(res =>  {
//         // when the cached data is available we don't need the `Observable` reference anymore
//         this.observable = null;

//         if(res.status == 400) {
// 			console.log("response status of 400!");
//           return "FAILURE";
//         } else if(res.status == 200) {
// 			console.log("response status of 200!");
//           this.serverData = new ServerData(res.json());

//           return this.serverData;
//         }
//         // make it shared so more than one subscriber can get the result
//       })
//       .share();
//       return this.observable;
//     }
//   }

//  Solution 2: login with one time call or no call from server side
//  if there is an error in authentication we have to clear cache data to be able to continue without problem
	// loginUser(user){
	// 	if (this.observable){
	// 		console.log("current Obs: ", this.observable);
	// 		return this.observable; 
	// 	} else { 
	// 			let headers = new Headers();
	// 			headers.append('Content-Type', 'application/json');
	// 			this.observable = this.http.post('http://localhost:3000/users/login', user, {headers: headers})
	// 				.map(res => res.json()).shareReplay();
	// 				console.log("OBSERVABLE: ",this.observable);
	// 				return this.observable;
			
					
	// 	}
	// }

//  Solution 3: login with one time call or no call from server side
//  if there is an error in authentication we have to clear cache data to be able to continue without problem
	cache$: Observable<any>;

	loginUser(user){
		if (this.cache$) {
			return this.cache$;
		}else{
			let headers = new Headers();
			headers.append('Content-Type', 'application/json');
			this.cache$ = cacheable<any>(this.http.post('http://localhost:3000/users/login', user, {headers: headers}));
			return this.cache$.map( res => res.json());
		}
	}
	



	socialLoginUser(user){
		if (this.cache$) {
			return this.cache$;
		}else{
			let headers = new Headers();
			headers.append('Content-Type', 'application/json');
			this.cache$ = cacheable<any>(this.http.post('http://localhost:3000/users/auth/social', user, {headers: headers}));
			return this.cache$.map( res => res.json());
		}
	}

	// socialLoginUser(user){
	// 	let headers = new Headers();
	// 	headers.append('Content-Type', 'application/json');
	// 	return this.http.post('http://localhost:3000/users/auth/social', user, {headers: headers})
	// 		.map(res => res.json());
	// }

	getProfile(token){
		let headers = new Headers();
		console.log("auth token: ", token);
		headers.append('Authorization', token);
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://localhost:3000/users/profile', {headers: headers})
			.map(res => res.json());
	}

}

