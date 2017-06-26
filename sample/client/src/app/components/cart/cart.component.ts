import { Component, OnChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartStore } from '../../store/cart.store';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {

  public cart = [];
  public totalPrice: number;
  public totalQuantity: number;
  public cartSubscription: Subscription;
  private cartEmpty: boolean;

  constructor(
          private productService: ProductService,
          private cartStore: CartStore,
          private userService: UserService
      ) {
      }

  removeProduct(product) {
    this.cartStore.removeFromCart(product)
  }

  getTotalPrice() {
    let totalCost: Array<number> = [];
    let quantity: Array<number> = [];
    let intPrice: number;
    let intQuantity: number;
    this.cart.forEach((item, i) => {
      intPrice = parseInt(item.price);
      intQuantity = parseInt(item.quantity);
      totalCost.push(intPrice);
      quantity.push(intQuantity);
    })

    this.totalPrice = totalCost.reduce((acc, item) => {
      return acc += item
    }, 0)
    this.totalQuantity = quantity.reduce((acc, item) => {
      return acc += item
    }, 0)
  }

  checkout() {
    if (this.userService.isLoggedIn()){
      alert('Under construction!');
    }else{
      alert('You must login first!');
    }
    
  }

  ngOnInit() {
    this.cartSubscription = this.cartStore.getState().subscribe(res => {
      this.cart = res.products;
      this.getTotalPrice();
    });
    if(this.cart.length>0){
      this.cartEmpty = false;
    }else{
      this.cartEmpty = true;
    }
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
  
}