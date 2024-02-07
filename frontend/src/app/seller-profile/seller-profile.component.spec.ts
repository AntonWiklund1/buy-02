import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerProfileComponent } from './seller-profile.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';


class MockUserService {
  getUser = jasmine.createSpy('getUser').and.returnValue(of({userId: "userId", name: "John Doe"}));
}
class MockProductService {
  getProductsByUserId = jasmine.createSpy('getProductsByUserId').and.returnValue(of({productId: "productId", name: "Product 1"}));
}

class MockSnackBar {
  open = jasmine.createSpy('open');
}

const mockStore = {
  select: jasmine.createSpy('select').and.returnValue(of('userId')),
};


describe('SellerProfileComponent', () => {
  let component: SellerProfileComponent;
  let fixture: ComponentFixture<SellerProfileComponent>;
  let userService: UserService;
  let productService: ProductService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        StoreModule.forRoot({}), // Ensure you import required modules
        SellerProfileComponent
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ProductService, useClass: MockProductService },
        { provide: MatSnackBar, useClass: MockSnackBar },
        { provide: Store, useValue: mockStore }
      ],

    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    productService = TestBed.inject(ProductService);
    snackBar = TestBed.inject(MatSnackBar);

  
    fixture.detectChanges();
});


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user and best selling products on init', () => {
    expect(userService.getUser).toHaveBeenCalled();
    expect(productService.getProductsByUserId).toHaveBeenCalled();
  });
});
