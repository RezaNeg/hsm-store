import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
// import { UserService } from './user.service';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private userService: UserService, private router: Router) {}

    canActivate() : boolean {
        console.log('isLoggedIn? ' + this.userService.isLoggedIn() );
        
        if (!this.userService.isLoggedIn()) {
            console.log('not auth');
            this.router.navigate(['/login']);
        }
        return this.userService.isLoggedIn();
    }

    canActivateChild() : boolean {
        return this.canActivate();
    }
}