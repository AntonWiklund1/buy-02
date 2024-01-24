import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../state/auth/auth.reducer';
import * as AuthSelectors from '../state/auth/auth.selector';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  orders: any[] = []; // Replace 'any' with your Order type
  userId$: Observable<string | null>;
  userId: string | undefined | null;
  constructor(
    private store: Store<{ auth: AuthState }>,
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {
    this.userId$ = this.store.select(AuthSelectors.selectUserId);
  }

  ngOnInit(): void {
    this.userId$.pipe(take(1)).subscribe((id) => {
      this.userId = id;
    });
    


    if (this.userId) {
      this.orderService.getOrdersByUserId(this.userId).subscribe(ordersData => {
        this.orders = ordersData.filter(order => order.status === 'CREATED');
      });
    }
  }

}
