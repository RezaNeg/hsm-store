// I dont use this screen service for the project as bootstrap is managing screen size
// and the content compoent has the same width as creen all the time. It might be used
// if we add some side bars or asides in which the main content will be smaller than
// the screen width.

import { HostListener, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ScreenService {
    private resizeSource = new Subject<null>();
    resize$ = this.resizeSource.asObservable();

    largeBreakpoint = 800;
    screenWidth = 1000;
    screenHeight = 800;

    constructor() {

        try {
            this.screenWidth = window.innerWidth;
            this.screenHeight = window.innerHeight;
            window.addEventListener('resize', (event) => this.onResize(event));
        }
        catch (e) {
            // we're going with default screen dimensions
        }
    }

    isLarge() : boolean {
        return this.screenWidth >= this.largeBreakpoint;
    }

    onResize($event) : void {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.resizeSource.next();
    }

}