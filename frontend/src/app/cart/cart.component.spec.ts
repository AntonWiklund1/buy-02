import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StompService } from '@stomp/ng2-stompjs';
import { ActivatedRoute, Router } from '@angular/router';

// Add your mock classes and services here as previously defined

// Declare fixture and component here, outside of beforeEach
let fixture: ComponentFixture<CartComponent>;
let component: CartComponent;

describe('CartComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Your TestBed configuration goes here
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch orders and products', () => {
    // Your test code here
  });

  it('should calculate total price correctly', () => {
    // Your test code here
  });

  // Add more tests as needed
});
