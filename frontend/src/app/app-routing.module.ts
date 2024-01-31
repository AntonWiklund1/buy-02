import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './logIn/logIn.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProductListComponent } from './product-list/product-list.component';
import {ProductManagementComponent} from './product-management/product-management.component';
import { ProfileManagementComponent } from './profile-management/profile-managment.component';
import { MediaManagementComponent } from './media-management/media-management.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { OrderListComponent } from './order-list/order-list.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { BuyerProfileComponent } from './buyer-profile/buyer-profile.component';

const routes: Routes = [
  { path: 'logIn', component: LogInComponent },
  { path: 'nav-bar', component: NavBarComponent},
  { path: 'productList', component: ProductListComponent},
  { path: 'productManagement', component: ProductManagementComponent},
  { path: 'profileManagment', component: ProfileManagementComponent},
  { path: 'mediaManagement', component: MediaManagementComponent},
  { path: 'home', component: HomeComponent},
  { path: 'cart', component: CartComponent},
  { path: 'orderList', component: OrderListComponent},
  { path: 'sellerProfile', component: SellerProfileComponent},
  { path: 'buyerProfile', component: BuyerProfileComponent},
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
