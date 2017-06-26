import { Component, OnInit } from '@angular/core';
import { FrameworkConfigService } from '../services/framework-config.service';
import { ScreenService } from '../services/screen.service';
import { UserApi } from '../userApi/user-api';


//change thiese after testing. not a good idea at all!
import { ProductService } from '../../app/services/product.service';
import {CartStore} from '../../app/store/cart.store';



@Component({
  selector: 'fw-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  public cart:any = [];
  public totalPrice: number;
  public totalQuantity: any;



  constructor(
        private frameworkConfigService: FrameworkConfigService,
        private screenService: ScreenService,
        private userApi: UserApi,
        private productService:ProductService,
        private cartStore: CartStore
  ) { }

  getTotalPrice() {
    let totalCost: Array<number> = []
    let quantity: Array<number> = []
    let intPrice: number
    let intQuantity: number

    this.cart.products.forEach((item, i) => {
      intPrice = parseInt(item.price)
      intQuantity = parseInt(item.quantity)
      totalCost.push(intPrice)
      quantity.push(intQuantity)
    })

    this.totalPrice = totalCost.reduce((acc, item) => {
      return acc += item
    }, 0)
    this.totalQuantity = quantity.reduce((acc, item) => {
      return acc += item
    }, 0)

  }

  ngOnInit() {
    this.cartStore.getState().subscribe(res => {
      this.cart = res
      this.getTotalPrice()
    })
  }

  onLogoutClick(){
    this.userApi.logout();
  }


}
