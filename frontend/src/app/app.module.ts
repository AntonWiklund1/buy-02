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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
