import { trigger, state, animate, transition, style } from '@angular/animations';

export const fadeInAnimation =
    trigger('fadeInAnimation', [
        // from nothing to 'enter' route transition
        transition(':enter', [    // css styles at start of transition
            style({ opacity: 0 }), // animation and styles at end of transition
            animate('300ms', style({ opacity: 1 })),
        ]),
        transition(':leave', [
            animate('300ms', style({ opacity: 0 }))
        ])
      
    ]);