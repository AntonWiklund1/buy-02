import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';

import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';
import { AuthState } from '../state/auth/auth.reducer';
import * as AuthSelectors from '../state/auth/auth.selector';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: any[] = []; // Replace 'any' with your order type
  userId$: Observable<string | null>;
  userId: string | null = null;
  productMediaUrls: Map<string, string> = new Map();
  totalPrice = 0;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private orderService: OrderService,
    private productService: ProductService,
    private mediaService: MediaService,
    private route: ActivatedRoute
  ) {
    this.userId$ = this.store.select(AuthSelectors.selectUserId);
  }

  ngOnInit(): void {
    this.userId$.pipe(take(1)).subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.fetchOrdersAndProducts();
      }
    });
  }

  // this method is used to fetch all orders and products for the current user
  fetchOrdersAndProducts(): void {
    this.orderService.getOrdersByUserId(this.userId!).subscribe((ordersData) => {
      this.cart = ordersData.filter((order) => order.isInCart);
      const productIds = [...new Set(this.cart.flatMap((order) => order.productIds))];
      this.preloadMediaForProducts(productIds);
      this.populateProductsAndCalculateTotal();
    });
  }

  // this method is used to populate the products array in each order
  populateProductsAndCalculateTotal(): void {
    const productObservables: Observable<any>[] = [];
    this.cart.forEach((order) => {
      order.products = [];
      order.productIds.forEach((productId: string) => {
        const productObservable = this.productService.getProductById(productId);
        productObservables.push(productObservable);
      });
    });

    if (productObservables.length > 0) {
      forkJoin(productObservables).subscribe((productsData) => {
        let productIndex = 0;
        this.cart.forEach((order) => {
          order.products = [];
          order.productIds.forEach(() => {
            order.products.push(productsData[productIndex]);
            productIndex++;
          });
        });

        this.totalPrice = this.calculateTotalPrice();
      });
    }
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;
    this.cart.forEach((order) => {
      order.products.forEach((product: any) => {
        totalPrice += product.price;
      });
    });
    return totalPrice;
  }

  preloadMediaForProducts(productIds: string[]): void {
    const backendUrl = 'https://localhost:8443/';
    const defaultImageUrl = 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png';

    productIds.forEach((productId) => {
      this.mediaService.getMedia(productId).subscribe(
        (mediaDataArray) => {
          if (Array.isArray(mediaDataArray) && mediaDataArray.length > 0) {
            const mediaObject = mediaDataArray[0];
            if (mediaObject && mediaObject.imagePath) {
              const imagePath = `${backendUrl}${mediaObject.imagePath}`;
              this.productMediaUrls.set(productId, imagePath);
            } else {
              this.productMediaUrls.set(productId, defaultImageUrl);
            }
          } else {
            this.productMediaUrls.set(productId, defaultImageUrl);
          }
        },
        (error) => {
          console.error(error);
          this.productMediaUrls.set(productId, defaultImageUrl);
        }
      );
    });
  }

  getMediaUrl(productId: string): string | undefined {
    return this.productMediaUrls.get(productId);
  }
}
