import { Observable } from 'rxjs/Observable';

export abstract class UserApi {
    constructor(parameters) {
        
    }
    localLogin : (  email: string,
                    password: string
                 ) => Observable<any>;
    
    socialLogin : ( email: string,
                    uid: string,
                    name: string, 
                    provider: string, 
                    image: string
                  ) => Observable<any>;
    

    register : (    firstname: string,
                    lastname: string,
                    email: string,
                    password: string
                 ) => any;
    logout : () => Observable<any>;

    getImageURL : () => string;

    // getProfile : () => Observable<any>;
}