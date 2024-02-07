import { Observable, of } from 'rxjs';

// Mock Store for NGRX
export class MockStore {
  select = jasmine.createSpy().and.returnValue(of('mockUserId'));
  dispatch = jasmine.createSpy();
}

// Mock OrderService
export class MockOrderService {
  getOrdersByUserId = jasmine.createSpy().and.returnValue(of([{ id: 'order1', productIds: ['product1', 'product2'] }]));
}

// Mock ProductService
export class MockProductService {
  getProductById = jasmine.createSpy().and.returnValue(of({ id: 'product1', name: 'Product 1' }));

}

// Mock MediaService
export class MockMediaService {
  getMedia = jasmine.createSpy().and.returnValue(of([{ imagePath: 'path/to/media.jpg' }]));
}
