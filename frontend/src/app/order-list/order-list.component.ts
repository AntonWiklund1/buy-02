import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthState } from '../state/auth/auth.reducer';
import * as AuthSelectors from '../state/auth/auth.selector';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  userId$: Observable<string | null>;
  userId: string | null = null;
  productMediaUrls: Map<string, string> = new Map();
  expandMore: boolean = true;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private orderService: OrderService,
    private productService: ProductService,
    private mediaService: MediaService
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

  fetchOrdersAndProducts(): void {
    this.orderService.getOrdersByUserId(this.userId!).subscribe((ordersData) => {
      this.orders = ordersData.map(order => ({ ...order, expanded: false }));
      const productIds = [...new Set(this.orders.flatMap((order) => order.productIds))];
      this.preloadMediaForProducts(productIds);
      this.populateProducts();
    });
  }
  preloadMediaForProducts(productIds: string[]): void {
    const backendUrl = 'https://localhost:8443/';
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

  populateProducts(): void {
    const productObservables: Observable<any>[] = [];
    this.orders.forEach((order) => {
      order.products = [];
      order.productIds.forEach((productId: string) => {
        const productObservable = this.productService.getProductById(productId);
        productObservables.push(productObservable);
      });
    });

    if (productObservables.length > 0) {
      forkJoin(productObservables).subscribe((productsData) => {
        let productIndex = 0;
        this.orders.forEach((order) => {
          order.products = [];
          order.productIds.forEach(() => {
            order.products.push(productsData[productIndex]);
            productIndex++;
          });
        });
      });
    }
  }

  // preloadMediaForProducts method remains the same as in your CartComponent

  getMediaUrl(productId: string): string | undefined {
    return this.productMediaUrls.get(productId);
  }

  expandOrder(order: any): void {
    order.expanded = !order.expanded;
  }
  
}
