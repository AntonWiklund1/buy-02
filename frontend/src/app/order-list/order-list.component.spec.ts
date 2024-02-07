import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component';
import { Store } from '@ngrx/store';
import { Observable, of, forkJoin } from 'rxjs';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';

import { MockStore, MockOrderService, MockProductService, MockMediaService } from '../services/mock.service';


describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let mockStore: MockStore;
  let mockOrderService: MockOrderService;
  let mockProductService: MockProductService;
  let mockMediaService: MockMediaService;

  beforeEach(async () => {
    // Recreate mock services for each test to ensure clean state
    mockStore = new MockStore();
    mockOrderService = new MockOrderService();
    mockProductService = new MockProductService();
    mockMediaService = new MockMediaService();

    await TestBed.configureTestingModule({
      imports: [OrderListComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: OrderService, useValue: mockOrderService },
        { provide: ProductService, useValue: mockProductService },
        { provide: MediaService, useValue: mockMediaService }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  afterEach(() => {
      mockProductService.getProductById.calls.reset();
      mockMediaService.getMedia.calls.reset();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly fetch and process orders on init', (done) => {
    spyOn(component, 'fetchOrdersAndProducts').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();

    component.userId$.subscribe(() => {
      expect(component.fetchOrdersAndProducts).toHaveBeenCalled();
      expect(mockOrderService.getOrdersByUserId).toHaveBeenCalledWith('mockUserId'); // Corrected to match mockStore's return
      expect(component.orders.length).toBe(1);
      expect(component.orders[0].productIds.length).toBe(2);
      done();
    });
  });
  
  it('should toggle order expansion', () => {
    // Initial setup for an order
    const order = { id: 'order1', expanded: false };
    component.expandOrder(order);
    expect(order.expanded).toBeTrue();

    // Simulate toggling back
    component.expandOrder(order);
    expect(order.expanded).toBeFalse();
  });

  // Add more tests as needed to cover different scenarios and edge cases
});
