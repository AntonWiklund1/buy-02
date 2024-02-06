import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';

// Correctly declare these at the top of your describe block
let component: OrderListComponent;
let fixture: ComponentFixture<OrderListComponent>;

// Mock classes
class MockStore {
  select = jasmine.createSpy().and.returnValue(of('mockUserId'));
}

class MockOrderService {
  getOrdersByUserId = jasmine.createSpy().and.returnValue(of([{ id: 'order1', productIds: ['product1', 'product2'] }]));
}

class MockProductService {
  getProductById = jasmine.createSpy().and.returnValue(of({ id: 'product1', name: 'Product 1' }));
}

class MockMediaService {
  getMedia = jasmine.createSpy().and.returnValue(of([{ imagePath: 'path/to/media.jpg' }]));
}

describe('OrderListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderListComponent],
      providers: [
        { provide: Store, useClass: MockStore },
        { provide: OrderService, useClass: MockOrderService },
        { provide: ProductService, useClass: MockProductService },
        { provide: MediaService, useClass: MockMediaService }
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch orders and product media on init', () => {
    // Make sure to call actual methods on your mock service instances if needed to verify interactions
    // This check needs to be adjusted according to what your mock data and component logic actually does
    expect(MockOrderService.prototype.getOrdersByUserId).toHaveBeenCalled();
    expect(component.orders.length).toBeGreaterThan(0); // Adjust this line based on your mock logic
    // Verify more interactions and component state as needed
  });
});
