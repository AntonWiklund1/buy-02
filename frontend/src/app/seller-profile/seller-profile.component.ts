import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, take, map, forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { AppState } from '../state/app.state';
import * as AuthSelectors from '../state/auth/auth.selector';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./seller-profile.component.css']
  
})
export class SellerProfileComponent implements OnInit {
  userId$: Observable<string | null>;
  token$: Observable<string | null>;
  bestSellingProducts: any[] = []; // Replace any with your Product type
  totalAmountGained: number = 0;
  userId: string | null | undefined;
  token: string | null | undefined;
  user: any;

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
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
      if (userId && token) {
        this.fetchUser();
        this.fetchOrdersAndCalculateBestSellers(userId);
      }
    });
  }

  fetchUser(): void {
    if (!this.userId || !this.token) {
      return;
    }
    this.userService.getUser(this.userId, this.token).subscribe((userData) => {
      this.user = userData;
      console.log("user: " + JSON.stringify(this.user));
    });
  }


  fetchOrdersAndCalculateBestSellers(userId: string): void {
    this.orderService.getAllOrders().subscribe((orders: Order[]) => {
      const productObservables = orders.map(order => {
        return forkJoin(order.productIds.map(productId =>
          this.productService.getProductById(productId).pipe(
            take(1),
            map((product: Product | null) => {
              // Check if product is null or does not have userId
              if (!product || product.userId !== userId) {
                return null;
              }
              return { productId, userId: product.userId };
            })
          ))
        );
      });

      forkJoin(productObservables).subscribe(productLists => {
        const productSaleCounts = new Map<string, number>();

        productLists.flat().forEach((productInfo) => {
          if (productInfo) {
            const count = productSaleCounts.get(productInfo.productId) || 0;
            productSaleCounts.set(productInfo.productId, count + 1);
          }
        });

        // Sort and extract product IDs
        const sortedProductIds = Array.from(productSaleCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([productId,]) => productId);

        // Fetch product details for the top-selling products
        const detailsObservables = sortedProductIds.slice(0, 2).map(productId =>
          this.productService.getProductById(productId)
        );

        forkJoin(detailsObservables).subscribe(productDetails => {
          this.bestSellingProducts = productDetails.filter(product => product != null);
          console.log(this.bestSellingProducts);
        });
      });
    }, error => {
      console.error('Error fetching orders:', error);
      this.showNotification('Error fetching orders');
    });
  }

  // Method to display a notification
  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
