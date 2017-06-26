import { Injectable } from '@angular/core';
import { PRODUCTS } from '../models/product-data';
import { Product } from '../models/Product'; 
// import { Observable, Subject } from 'rxjs';

import { Http, Headers } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/operator/map';



@Injectable()
export class ProductService {

    constructor(
        private http: Http
    ) { 
    }

// to get all data from file:
    getProducts() {
        return Promise.resolve(PRODUCTS);
    }

// to get specific data from file 
    getProduct(id) {
        return this.getProducts()
            .then(products => products.find(product => product.id === id));
    }


// to get specific data from server

    getProductFromServer(id){
        let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://localhost:3000/product-detail/' + id , {headers: headers})
			.map(res => res.json());

    }
// to get all porducts from server
    getProductsFromServer(){
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://localhost:3000/products', {headers: headers})
			.map(res => res.json());
    }


}
