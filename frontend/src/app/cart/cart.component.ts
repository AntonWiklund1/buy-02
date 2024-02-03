import { Component, OnInit, OnDestroy } from '@angular/core';
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

import * as CartActions from '../state/cart/cart.actions';
import { CartState } from '../state/cart/cart.reducer';
import { selectOrderId } from '../state/cart/cart.selectors';
import { AppState } from '../state/app.state';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { WebSocketService } from '../services/websocket.service';

import { StompMessage } from '../models/StompMessage.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  cart: any[] = []; // Replace 'any' with your order type
  userId$: Observable<string | null>;
  orderId$: Observable<string | null>;
  orderId: string | null = null;
  userId: string | null = null;
  productMediaUrls: Map<string, string> = new Map();
  totalPrice = 0;

  private orderConfirmationSubscription: any;


  constructor(
    private store: Store<AppState>,
    private orderService: OrderService,
    private productService: ProductService,
    private mediaService: MediaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private webSocketService: WebSocketService


  ) {
    this.userId$ = this.store.select(AuthSelectors.selectUserId);
    this.orderId$ = this.store.select(selectOrderId);
  }

  ngOnInit(): void {
    this.userId$.pipe(take(1)).subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.fetchOrdersAndProducts();
      }
    });
    this.orderId$.pipe(take(1)).subscribe((id) => {
      if (id) {
        this.orderId = id;
      }
    });

    if (this.webSocketService.isConnected()) {
      this.subscribeToOrderConfirmations();
    } else {
      alert('WebSocket is not connected');
    }
    this.orderConfirmationSubscription = this.webSocketService.stompClient.subscribe('/topic/order-confirmation', (message: StompMessage) => {
      if (message.body) {
        const messageData = JSON.parse(message.body);
        // Handle the order confirmation message
        this.handleOrderConfirmation(messageData);
      }
    });

  }


  ngOnDestroy(): void {
    if (this.orderConfirmationSubscription) {
      this.orderConfirmationSubscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  private subscribeToOrderConfirmations(): void {
    this.orderConfirmationSubscription = this.webSocketService.stompClient.subscribe('/topic/order-confirmation', (message: StompMessage) => {
      if (message.body) {
        const messageData = JSON.parse(message.body);
        this.handleOrderConfirmation(messageData);
      }
    });
  }

  private handleOrderConfirmation(messageData: any): void {
    // Logic to handle order confirmation message
    if (messageData.orderId && messageData.status === 'CONFIRMED') {
      console.log(`Order ${messageData.orderId} has been confirmed`);
      // Update the UI or state as needed
      // ...
    } else if (messageData.status === 'DENIED') {
      console.log(`Order ${messageData.orderId} has been denied`);
      // Handle denied order
      // ...
    }
  }



  // this method is used to fetch all orders and products for the current user
  fetchOrdersAndProducts(): void {
    this.orderService
      .getOrdersByUserId(this.userId!)
      .subscribe((ordersData) => {
        this.cart = ordersData.filter((order) => order.isInCart);
        this.storeOrderIdInState(this.cart[0].id)
        const productIds = [
          ...new Set(this.cart.flatMap((order) => order.productIds)),
        ];
        this.preloadMediaForProducts(productIds);
        this.populateProductsAndCalculateTotal();
      });
  }

  // Fetches product details and calculates total price after all product data is fetched
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
      // Using forkJoin to wait for all product data to be fetched
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

  getMediaUrl(productId: string): string | undefined {
    return this.productMediaUrls.get(productId);
  }

  removeFromCart(orderId: string, productId: string): void {
    this.orderService.deleteProductFromOrder(orderId, productId).subscribe(() => {
      this.fetchOrdersAndProducts();
      this.showNotification('Product removed from cart successfully');
    });
  }

  addToCart(productId: string): void {
    if (!this.userId) {
      console.error('User is not logged in');
      return;
    }
    this.orderService.addProductToCart(this.userId, productId).subscribe(() => {
      this.fetchOrdersAndProducts();
      this.showNotification('Product added to cart successfully');
    });
  }

  storeOrderIdInState(orderId: string): void {
    this.store.dispatch(CartActions.storeOrderId({ orderId }));
  }

  buy(): void {
    console.log(this.orderId)
    this.orderService.buyProducts(this.orderId!).subscribe(() => {
      //navigate to order history

      this.router.navigate(['/home']); // Navigate after orderId is set
      this.showNotification('Order placed successfully');
    });
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      panelClass: 'custom-snackbar',
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
