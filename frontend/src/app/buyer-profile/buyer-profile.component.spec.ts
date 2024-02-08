import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyerProfileComponent } from './buyer-profile.component';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { MediaService } from '../services/media.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';

// Mock services
class MockUserService {
  getUser = jasmine.createSpy().and.returnValue(of({/* Mock user data */}));
}
class MockProductService {
  getProductById = jasmine.createSpy().and.returnValue(of({/* Mock product data */}));
  removeFromFavorites = jasmine.createSpy().and.returnValue(of({}));
}
class MockOrderService {
  getOrdersByUserId = jasmine.createSpy().and.returnValue(of([/* Mock orders data */]));
  addProductToCart = jasmine.createSpy().and.returnValue(of({}));
}
class MockMediaService {
  getMedia = jasmine.createSpy().and.returnValue(of([/* Mock media data */]));
}
const mockSnackBar = {
  open: jasmine.createSpy('open')
};

// Mock Store
const mockStore = {
  select: jasmine.createSpy().and.returnValue(of('mockUserId', 'mockToken'))
};

describe('BuyerProfileComponent', () => {
  let component: BuyerProfileComponent;
  let fixture: ComponentFixture<BuyerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BuyerProfileComponent // Move BuyerProfileComponent here
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ProductService, useClass: MockProductService },
        { provide: OrderService, useClass: MockOrderService },
        { provide: MediaService, useClass: MockMediaService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Store, useValue: mockStore }
      ]
    })
    .compileComponents();
  
    fixture = TestBed.createComponent(BuyerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Example test: ngOnInit fetches user and token
  it('should fetch user and token on init', (done) => {
    fixture.whenStable().then(() => {
      expect(mockStore.select).toHaveBeenCalled();
      done();
    });
  });

});
