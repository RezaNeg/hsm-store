import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { LightboxModule } from 'angular2-lightbox';

import { AppComponent } from './app.component';
import { FwModule } from '../fw/fw.module';
import { ServicesComponent } from './components/services/services.component';
import { ProductsComponent } from './components/products/products.component';
import { appRoutes } from './app.routing';
import { ProfileComponent } from './components/profile/profile.component';

import { UserService } from './services/user.service';
import { AuthGuard } from './services/auth-guard.service';
import { UserApi } from '../fw/userApi/user-api';
import { MainAuthService } from './services/main-auth.service';
// import { FrameworkConfigService } from '../fw/services/Framework-config.service';

// added for cart
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductService } from './services/product.service';
import { reducer } from './store/reducers';
import { CartStore } from './store/cart.store';



@NgModule({
  declarations: [
    AppComponent,
    ServicesComponent, 
    ProductsComponent,
    ProfileComponent,
    ProductDetailComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule,
    FwModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.provideStore(reducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    LightboxModule
  ],
  providers: [
    UserService,
    { provide: UserApi, useExisting: UserService },
    
    AuthGuard,
    MainAuthService,
    ProductService,
    CartStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }