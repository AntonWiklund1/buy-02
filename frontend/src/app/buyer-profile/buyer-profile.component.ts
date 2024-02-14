import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserService } from '../services/user.service';
import * as AuthSelectors from '../state/auth/auth.selector';
import { Observable, combineLatest, take } from 'rxjs';
import { AppState } from '../state/app.state';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaService } from '../services/media.service';


@Component({
  selector: 'app-buyer-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buyer-profile.component.html',
  styleUrl: './buyer-profile.component.css'
})
export class BuyerProfileComponent implements OnInit {
  userId: string | null | undefined;
  userId$: Observable<string | null>;
  token: string | null | undefined;
  token$: Observable<string | null>;
  favoriteProductsDetails: any[] = []; // Replace 'any' with your product type
  orders: any[] = []; // Replace 'any' with your order type
  user: any;
  productIds: string[] = [];
  mostBoughtProduct = "";
  mostBoughtProductDetails: any;
  productMediaUrls: Map<string, string> = new Map();
  showFavoriteProducts = true;

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
    private mediaService: MediaService,
    private snackBar: MatSnackBar
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
    this.fetchBoughtProducts();
  }

  fetchUser(): void {

    if (!this.userId || !this.token) {
      return;
    }
    this.userService.getUser(this.userId, this.token).subscribe((userData) => {
      this.user = userData;
      this.fetchFavoriteProductsDetails();
    });
  }

  fetchFavoriteProductsDetails(): void {
    if (this.user?.favoriteProducts) {
      this.user.favoriteProducts.forEach((productId: any) => {
        this.productService.getProductById(productId).subscribe((product: any) => {
          this.favoriteProductsDetails.push(product);
          // Fetch media for each product
          this.fetchMediaForProduct(productId);
        });
      });
    }
  }

  fetchMediaForProduct(productId: string): void {
    const backendUrl = 'https://localhost:8443/';

    const defaultImageUrl = 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png';
    this.mediaService.getMedia(productId).subscribe(
      (mediaDataArray) => {
        let imageUrl = defaultImageUrl;
        if (Array.isArray(mediaDataArray) && mediaDataArray.length > 0) {
          const mediaObject = mediaDataArray[0];
          if (mediaObject?.imagePath) {
            imageUrl = `${backendUrl}${mediaObject.imagePath}`;
          }
        }
        this.productMediaUrls.set(productId, imageUrl);
      },
      (error) => {
        console.error(error);
        this.productMediaUrls.set(productId, defaultImageUrl);
      }
    );
  }

  getMediaUrl(productId: string): string | undefined {
    return this.productMediaUrls.get(productId);
  }


  fetchBoughtProducts(): void {
    this.orderService
      .getOrdersByUserId(this.userId!)
      .subscribe((ordersData) => {
        this.orders = ordersData.filter(order => !order.isInCart);
        this.orders.forEach((order) => {
          order.productIds.forEach((productId: string) => {
            this.productIds.push(productId);
          });
        });
        this.getMostBoughtProduct()
      });
  }

  //get the most bought product from this.productIds
  getMostBoughtProduct(): string {
    let counts: any = {};
    let compare = 0;
    for (const word of this.productIds) {
      if (counts[word] === undefined) {
        counts[word] = 1;
      } else {
        counts[word] = counts[word] + 1;
      }
      if (counts[word] > compare) {
        compare = counts[word];
        this.mostBoughtProduct = word;
      }
    }
    this.getProductById(this.mostBoughtProduct);
    return this.mostBoughtProduct;
  }

  getProductById(productId: string): any {
    this.productService.getProductById(productId).subscribe((product: any) => {
      this.mostBoughtProductDetails = product;
    }
    );
  }


  removeFromFavorite(productId: string): void {
    if (!this.userId) {
      return;
    }
    this.productService.removeFromFavorites(this.userId, productId).subscribe(() => {
      this.favoriteProductsDetails = this.favoriteProductsDetails.filter(product => product.id !== productId);
      this.showNotification('Product removed from favorites successfully');
    });
  }

  addToCart(productId: string): void {
    if (!this.userId) {
      return;
    }
    this.orderService.addProductToCart(this.userId, productId).subscribe(() => {
      this.showNotification('Product added to cart successfully');
    });
  }


  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      panelClass: 'custom-snackbar',
      duration: 3000,
      verticalPosition: 'top', // This positions the snackbar at the top of the screen
      horizontalPosition: 'center', // This centers the snackbar horizontally
    });
  }

  toggleFavoriteProducts() {
    this.showFavoriteProducts = !this.showFavoriteProducts;
  }

}
