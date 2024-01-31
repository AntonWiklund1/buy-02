import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { UserService } from '../services/user.service';
import * as AuthSelectors from '../state/auth/auth.selector';
import { Observable, combineLatest, take } from 'rxjs';
import { AppState } from '../state/app.state';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [],
  templateUrl: './seller-profile.component.html',
  styleUrl: './seller-profile.component.css'
})
export class SellerProfileComponent {
  userId: string | null | undefined;
  userId$: Observable<string | null>;
  token: string | null | undefined;
  token$: Observable<string | null>;
  user: any;
  totalAmountGained = 0;
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
    this.userService.getUser(this.userId, this.token).subscribe(
      (data) => {
        this.user = data;
        if (this.user.totalAmountGained) {
          this.totalAmountGained = this.user.totalAmountGained;
        }else{
          this.totalAmountGained = 0;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
