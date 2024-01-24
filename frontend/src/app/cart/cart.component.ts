import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { Observable, of, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../state/auth/auth.reducer';
import * as AuthSelectors from '../state/auth/auth.selector';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cart: any[] = []; // Assuming you have a type for your order, replace any with that type
  userId$: Observable<string | null>;
  userId: string | undefined | null;
  productMediaUrls: Map<string, string> = new Map(); // Map to store media URLs

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
      // Fetch orders and products after the userId is set
      if (this.userId) {
        this.fetchOrdersAndProducts();
      }
    });
  }

  fetchOrdersAndProducts(): void {
    this.orderService
      .getOrdersByUserId(this.userId!)
      .subscribe((ordersData) => {
        this.cart = ordersData.filter((order) => order.isInCart === true);
        // Flatten productIds from all orders into a unique set to avoid duplicate requests
        const productIds = [
          ...new Set(this.cart.flatMap((order) => order.productIds)),
        ];
        this.preloadMediaForProducts(productIds);
        this.cart.forEach((order) => {
          order.products = []; // Add a products array to each order
          order.productIds.forEach((productId: string) => {
            this.productService
              .getProductById(productId)
              .subscribe((productData) => {
                order.products.push(productData); // Add product data to the order
              });
          });
        });
      });
  }

  preloadMediaForProducts(productIds: string[]): void {
    const backendUrl = 'https://localhost:8443/'; // Adjust this URL to where your backend serves media files
    const defaultImageUrl =
      'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png';

    productIds.forEach((productId) => {
      this.mediaService.getMedia(productId).subscribe(
        (mediaDataArray) => {
          if (Array.isArray(mediaDataArray) && mediaDataArray.length > 0) {
            const mediaObject = mediaDataArray[0];
            if (mediaObject && mediaObject.imagePath) {
              const imagePath = `${backendUrl}${mediaObject.imagePath}`;
              this.productMediaUrls.set(productId, imagePath);
            } else {
              // If there is a mediaObject but no imagePath, set to default image
              this.productMediaUrls.set(productId, defaultImageUrl);
            }
          } else {
            // If there is no media data array, set to default image
            this.productMediaUrls.set(productId, defaultImageUrl);
          }
        },
        (error) => {
          console.error(error);
          // If there is an error fetching the media, set to default image
          this.productMediaUrls.set(productId, defaultImageUrl);
        }
      );
    });
  }

  getMediaUrl(productId: string): string | undefined {
    console.log(this.productMediaUrls.get(productId));
    return this.productMediaUrls.get(productId);
  }
}
