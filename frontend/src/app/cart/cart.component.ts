import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription, forkJoin } from 'rxjs';
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

import { StompService } from '@stomp/ng2-stompjs';

import * as SockJS from 'sockjs-client';

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
  orderId$: Observable<string | null>;
  orderId: string | null = null;
  userId: string | null = null;
  productMediaUrls: Map<string, string> = new Map();
  totalPrice = 0;

  stompClient: any;
  topic: string = '/topic/orderUpdate';
  webSocketEndPoint: string = 'wss://localhost:8084/ws';

  messagesSubscription: Subscription | undefined;

  isPayOnDeliveryChecked = false;


  constructor(
    private store: Store<AppState>,
    private orderService: OrderService,
    private productService: ProductService,
    private mediaService: MediaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private stompService: StompService


  ) {
    this.userId$ = this.store.select(AuthSelectors.selectUserId);
    this.orderId$ = this.store.select(selectOrderId);

  }

  ngOnInit(): void {
    this.userId$.pipe(take(1)).subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.fetchOrdersAndProducts();
        this.listenForOrderUpdates();
      }
    });
    this.orderId$.pipe(take(1)).subscribe((id) => {
      if (id) {
        this.orderId = id;
      }
    });
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }


  // this method is used to fetch all orders and products for the current user
  fetchOrdersAndProducts(): void {
    this.orderService
      .getOrdersByUserId(this.userId!)
      .subscribe((ordersData) => {
        this.cart = ordersData.filter((order) => order.isInCart);
        if (this.cart.length === 0) {
          return;
        }
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

  listenForOrderUpdates(): void {
    this.messagesSubscription = this.stompService.subscribe(this.topic).subscribe(
      (message) => {
        const messageBody = message.body;

        // Check if the message starts with "Order confirmed:"
        if (messageBody.startsWith('Order confirmed:')) {
          // Extract the orderId from the message
          const orderId = messageBody.split(':')[1].trim(); // Split by ":" and get the second part
          this.showNotification(`Order confirmed: ${orderId}`);
          this.router.navigate(['/home']);
        } else if ( messageBody.startsWith('Order denied:')) {
          // Handle other message types or conditions
          const orderId = messageBody.split(':')[1].trim(); // Split by ":" and get the second part
          this.showNotification(`Order denied: ${orderId}`);
        } else {
          this.showNotification('an error occurred during the order process');
        }
      },
      (error) => {
        console.error(error);
        this.showNotification('Error placing order');
      }
    );
  }

  buy(): void {

    this.orderId$.pipe(take(1)).subscribe((id) => {
      if (id) {
        this.orderId = id;
      }
    });
    if (!this.orderId) {
      console.error('Order ID is not set');
      return;
    }
    this.orderService.buyProducts(this.orderId).subscribe(() => {
      this.store.dispatch(CartActions.storeOrderId({ orderId: "null" }));
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

  togglePayOnDelivery() {
    this.isPayOnDeliveryChecked = !this.isPayOnDeliveryChecked;
  }

}
