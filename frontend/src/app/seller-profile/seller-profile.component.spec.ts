import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerProfileComponent } from './seller-profile.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

class MockUserService {
  getUser(userId: string, token: string) {
    return of({/* Mock user data */});
  }
}

class MockProductService {
  getProductsByUserId(userId: string) {
    return of([/* Mock product data */]);
  }
}

class MockOrderService {
  // Mock methods as needed
}

class MockSnackBar {
  open(message: string, action?: string, config?: any) {
    // Mock implementation
  }
}

const mockStore = {
  select: (selector: any) => of('mockValue')
};

describe('SellerProfileComponent', () => {
  let component: SellerProfileComponent;
  let fixture: ComponentFixture<SellerProfileComponent>;
  let userService: UserService;
  let productService: ProductService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Ensure to declare your component and import necessary modules here
      declarations: [SellerProfileComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ProductService, useClass: MockProductService },
        { provide: OrderService, useClass: MockOrderService },
        { provide: MatSnackBar, useClass: MockSnackBar },
        { provide: Store, useValue: mockStore }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    productService = TestBed.inject(ProductService);
    snackBar = TestBed.inject(MatSnackBar);

    spyOn(userService, 'getUser').and.callThrough();
    spyOn(productService, 'getProductsByUserId').and.callThrough();
    spyOn(snackBar, 'open').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user and best selling products on init', () => {
    expect(userService.getUser).toHaveBeenCalled();
    expect(productService.getProductsByUserId).toHaveBeenCalled();
  });

  it('should display notification on error fetching best-selling products', () => {
    // Adjust mock to simulate an error response
    spyOn(productService, 'getProductsByUserId').and.returnValue(of(new Error('Error fetching best-selling products')));
    component.fetchBestSellingProducts('userId');
    expect(snackBar.open).toHaveBeenCalledWith('Error fetching best-selling products', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  });

  // Add more tests as necessary
});
