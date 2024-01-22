import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { ProductManagementComponent } from './product-management.component';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';
import { of } from 'rxjs';

// Mock implementations for services
class MockProductService {
  getProductsByUserId = jasmine.createSpy('getProductsByUserId').and.returnValue(of([]));
  addProduct = jasmine.createSpy('addProduct').and.returnValue(of({ productId: 'testId' }));
  getProductById = jasmine.createSpy('getProductById').and.returnValue(of({}));
  editProduct = jasmine.createSpy('editProduct').and.returnValue(of({}));
  deleteProduct = jasmine.createSpy('deleteProduct').and.returnValue(of({}));
  // Implement other methods as necessary
}

class MockMediaService {
  getMedia = jasmine.createSpy('getMedia').and.returnValue(of([]));
  uploadMedia = jasmine.createSpy('uploadMedia').and.returnValue(of({}));
  // Implement other methods as necessary
}

// Provide a basic mock for the AuthState
function mockAuthReducer(state: any, action: any) {
  // Implement mock reducer logic if needed, or return a default state
  return state;
}

describe('ProductManagementComponent', () => {
  let component: ProductManagementComponent;
  let fixture: ComponentFixture<ProductManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({ auth: mockAuthReducer }), // Mock the store module using an empty reducer
      ],
      declarations: [ProductManagementComponent],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: MediaService, useClass: MockMediaService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests here to verify the component's behavior
});
