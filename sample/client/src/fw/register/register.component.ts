import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserApi } from '../userApi/user-api';
import { FrameworkConfigService } from '../services/framework-config.service';
import { fadeInAnimation, slideInOutAnimation } from '../animations/index.animation';

@Component({
  selector: 'fw-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [ fadeInAnimation, slideInOutAnimation ]

})
export class RegisterComponent implements OnInit {

  formError: string;
  formMsg: string;
  submitting = false;

  constructor(
    private userApi: UserApi,
    private router: Router,
    private frameworkConfigService : FrameworkConfigService,
  ) {
      this.frameworkConfigService.showUserControls = false;
      this.frameworkConfigService.showNavbar = false;
   }

  ngOnInit() {
  }
  

  onRegisterSubmit(registerForm: NgForm) {
    if (registerForm.valid) {
      console.log('submitting...', registerForm);
      this.submitting = true;
      this.formError = null;

      this.userApi.register(  registerForm.value.firstname,
                              registerForm.value.lastname,
                              registerForm.value.email,
                              registerForm.value.password
                            )
        .subscribe((data) => {
          console.log("Data back from server: ", data);
          if (data.success){
            this.formMsg = data.msg;
            setTimeout(()=>{ this.formMsg = "Login please..."}, 2000);
            this.submitting = false;
            setTimeout(()=>{ this.formMsg = ""}, 4000);
            // this.router.navigate(['/login']);
          }else{
            this.submitting = false;
            this.formError = data.msg;
            setTimeout(()=>{ this.formError = ""}, 2000);
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

}
 