import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './logIn/logIn.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductManagementComponent } from './product-management/product-management.component';
import { ProfileManagementComponent } from './profile-management/profile-managment.component';
import { HomeComponent } from './home/home.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { authReducer } from './state/auth/auth.reducer';
import { avatarReducer } from './state/avatar/profile.reducer'; // Import the avatar reducer
import { environment } from '../environments/environment';
import { MediaManagementComponent } from './media-management/media-management.component';
import { CommonModule } from '@angular/common';
import { cartReducer } from './state/cart/cart.reducer';
import { APP_INITIALIZER } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { selectUserId } from './state/auth/auth.selector';
import * as CartActions from './state/cart/cart.actions';
import { OrderService } from './services/order.service';
import { take } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import SockJS from 'sockjs-client';




//stores the order id in the store if the user has a cart order
export function initializeApp(orderService: OrderService, store: Store<AppState>) {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {
      store.select(selectUserId).pipe(take(1)).subscribe((userId) => {
        if (userId) {
          orderService.getOrdersByUserId(userId).subscribe((ordersData) => {
            const cartOrder = ordersData.find((order) => order.isInCart);
            if (cartOrder) {
              store.dispatch(CartActions.storeOrderId({ orderId: cartOrder.id }));
            }
            resolve(true);
          }, reject);
        } else {
          resolve(true);
        }
      });
    });
  };
}

// Define your Stomp configuration - this example assumes a SockJS endpoint
export function stompConfigFactory() {
  const config = new StompConfig();
  config.url = () => new SockJS('https://localhost:8084/ws');
  config.headers = {};
  config.heartbeat_in = 0;
  config.heartbeat_out = 20000;
  config.reconnect_delay = 5000;
  config.debug = true;
  return config;
 }

 export function stompServiceFactory(config: StompConfig) {
  return new StompService(config);
}





@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    NavBarComponent,
    ProductListComponent,
    ProductManagementComponent,
    ProfileManagementComponent,
    HomeComponent,
    MediaManagementComponent,

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({
      auth: authReducer,
      avatar: avatarReducer,
      cart: cartReducer,
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      
      useFactory: initializeApp,
      deps: [OrderService, Store],
      multi: true,
    },
    {
      provide: StompConfig,
      useFactory: stompConfigFactory
    },
    {
      provide: StompService,
      useFactory: stompServiceFactory,
      deps: [StompConfig] // Dependency list for your factory
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
