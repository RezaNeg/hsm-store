import { Routes } from '@angular/router';

import { ProfileComponent } from './components/profile/profile.component';
import { ServicesComponent } from './components/services/services.component';
import { ProductsComponent } from './components/products/products.component';
import { LoginComponent } from '../fw/login/login.component';
import { RegisterComponent } from '../fw/register/register.component';
import { AuthGuard } from './services/auth-guard.service';

import { AppComponent }  from './app.component';
import { ProductDetailComponent }  from './components/product-detail/product-detail.component';
import { CartComponent }  from './components/cart/cart.component';


export const appRoutes: Routes = [  
	{ path: '', redirectTo: 'services', pathMatch: 'full' },
	{ path: 'register', component: RegisterComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'services', component: ServicesComponent },
	{ path: 'products', component: ProductsComponent },
	{ path: 'product-detail/:id', component: ProductDetailComponent },
	{ path: 'cart', component: CartComponent },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]  },
	{ path: '**', redirectTo: 'services', pathMatch: 'full' }
];