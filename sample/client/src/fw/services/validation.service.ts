import { Injectable } from '@angular/core';
import {AbstractControl} from '@angular/forms';


@Injectable()
export class ValidationService {

  constructor() { }
  
	// all fields are filled
  isFilledRegForm(user){
		if (user.firstname == undefined || 
			user.lastname == undefined || 
			user.email == undefined || 
			user.password == undefined || 
			user.password2 == undefined
			){
			return false;
		}else{ 
			return true;
		}
	}

	isEmailFilled(email){
		if (email == undefined){
			return false;
		}else{
			return true;
		}
	}

	// email format is correct
	isEmailValid (email){
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(email);
	}

	// passwords match
	isSamePassword(pass1, pass2){
		if (pass1 != pass2){
			return false;
		}else{ 
			return true;
		}
	}

	matchPassForm(AC){
		let password = AC.get('password').value; // to get value in input tag
       	let password2= AC.get('password2').value; // to get value in input tag
        if (password != password2) {
            console.log('false');
            AC.get('password2').setErrors( {MatchPassword: true} )
        } else {
            console.log('true');
            return null
        }
    }
}