import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserService } from '../services/user.service';
import * as AuthSelectors from '../state/auth/auth.selector';
import { Observable, combineLatest, take } from 'rxjs';
import { AppState } from '../state/app.state';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-buyer-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buyer-profile.component.html',
  styleUrl: './buyer-profile.component.css'
})
export class BuyerProfileComponent implements OnInit{
  userId: string | null | undefined;
  userId$: Observable<string | null>;
  token: string | null | undefined;
  token$: Observable<string | null>;
  favoriteProductsDetails: any[] = []; // Replace 'any' with your product type

  user: any;
  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
  ) {
    this.userId$ = this.store.select(AuthSelectors.selectUserId);
    this.token$ = this.store.select(AuthSelectors.selectToken);
  }

  ngOnInit(): void {
    combineLatest([
      this.userId$.pipe(take(1)),
      this.token$.pipe(take(1))
    ]).subscribe(([userId, token]) => {
      this.userId = userId;
      this.token = token;
      if (this.userId && this.token) {
        this.fetchUser();
      }
    });
  }
  
  fetchUser(): void {
    console.log("fetchUser: " + this.userId + " " + this.token);
    if (!this.userId || !this.token) {
      return;
    }
    this.userService.getUser(this.userId, this.token).subscribe((userData) => {
      this.user = userData;
      this.fetchFavoriteProductsDetails();
      console.log("user: " + JSON.stringify(this.user));
    });
  }

  fetchFavoriteProductsDetails(): void {
    if (this.user?.favoriteProducts) {
       this.user.favoriteProducts.forEach((productId: any) => {
         this.productService.getProductById(productId).subscribe((product: any) => {
           this.favoriteProductsDetails.push(product);
         });
       });
    }
   }

   removeFromFavorite(productId: string): void {
    if (!this.userId) {
      return;
    }
    this.productService.removeFromFavorites(this.userId, productId).subscribe(() => {
      this.favoriteProductsDetails = this.favoriteProductsDetails.filter(product => product.id !== productId);
    });
  }

  addToCart(productId: string): void {
    if (!this.userId) {
      return;
    }
    this.orderService.addProductToCart(this.userId, productId).subscribe(() => {
      console.log("Product added to cart");
    });
  }
}
