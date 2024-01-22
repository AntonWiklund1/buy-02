import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { MediaManagementComponent } from './media-management.component';
import { MediaService } from '../services/media.service';
import { ProductService } from '../services/product.service';
import { of } from 'rxjs';

// Mock implementations for services
class MockMediaService {
  getMediaByProductId = jasmine.createSpy('getMediaByProductId').and.returnValue(of([]));
  uploadMedia = jasmine.createSpy('uploadMedia').and.returnValue(of({}));
  deleteMedia = jasmine.createSpy('deleteMedia').and.returnValue(of({}));
}

class MockProductService {
  getProductsByUserId = jasmine.createSpy('getProductsByUserId').and.returnValue(of([]));
}

// Provide a basic mock for the AuthState
function mockAuthReducer(state: any, action: any) {
  // Implement mock reducer logic if needed, or return a default state
  return state;
}

describe('MediaManagementComponent', () => {
  let component: MediaManagementComponent;
  let fixture: ComponentFixture<MediaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({ auth: mockAuthReducer }), // Mock the store module using an empty reducer
      ],
      declarations: [MediaManagementComponent],
      providers: [
        { provide: MediaService, useClass: MockMediaService },
        { provide: ProductService, useClass: MockProductService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests here to verify the component's behavior
});
