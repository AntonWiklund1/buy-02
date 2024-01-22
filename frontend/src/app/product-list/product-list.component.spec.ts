import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';
import { of } from 'rxjs';

// Mock implementations for services
class MockProductService {
  getProducts = jasmine.createSpy('getProducts').and.returnValue(of([]));
}

class MockMediaService {
  getMedia = jasmine.createSpy('getMedia').and.returnValue(of([]));
}

// Provide a basic mock for the AuthState
function mockAuthReducer(state: any, action: any) {
  // Implement mock reducer logic if needed, or return a default state
  return state;
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Mock the store module using an empty reducer or a specific mock reducer
        StoreModule.forRoot({ auth: mockAuthReducer }),
      ],
      declarations: [ProductListComponent],
      providers: [
        // Provide the mock services
        { provide: ProductService, useClass: MockProductService },
        { provide: MediaService, useClass: MockMediaService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests here
});
