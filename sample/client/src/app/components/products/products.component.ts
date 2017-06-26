import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FlashMessagesService} from 'angular2-flash-messages'
// import { Lightbox, IAlbum } from 'angular2-lightbox';

import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { CartStore } from '../../store/cart.store';
;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  products:Product[];
  quantity: number[];
  // private albums: Array<any> = [];

  

  constructor (private productService:ProductService,
               private router:Router, 
               private cartStore: CartStore,
               private flashMessage: FlashMessagesService
              //  private lightbox: Lightbox
              ) {
}
  
  clickedProduct(product) {
      this.router.navigate(['/product-detail', product.id]);
  }


  addToCart(product) {
    console.log(this.quantity)
    this.cartStore.addToCart(product, this.quantity || 1)
  }

  getProductData() {    
    //   // this is to load data from a file: 
    //  this.productService.getProducts().then(products => this.products = products);
      // this is to load data from server 
      this.productService.getProductsFromServer().subscribe(data => {
        console.log("Product DATA from server: ", data);
        if (data.success){
          // this.flashMessage.show(data.msg, {cssClass: 'alert-info', timeout: 2000});
          this.products = data.products;
          console.log("all products: ", data.products);
          // for (let i = 0; i < data.products.length; i++) {
          //   const src = data.products[i]['src'];
          //   const caption = data.products[i]['name'];
          //   const thumb = data.products[i]['thumb'];
          //   const album = {
          //     src: src,
          //     caption: caption,
          //     thumb: thumb
          //   };
          //   this.albums.push(album);
          // }
          // console.log("albums: ", this.albums);
        }else{
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 2000});
        }
        
      })
  }

  // open(i): void {
  //   // open lightbox 
  //   this.lightbox.open(this.albums, i);
  // }

  ngOnInit() {
    // Get initial data from productService to display on the page
    this.getProductData();
  }

}
