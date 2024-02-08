import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { StompService } from '@stomp/ng2-stompjs';

// Add your mock classes and services here as previously defined

// Declare fixture and component here, outside of beforeEach
let fixture: ComponentFixture<CartComponent>;
let component: CartComponent;

const mockStore = {
  select: jasmine.createSpy('select').and.returnValue(of({})),
  dispatch: jasmine.createSpy('dispatch'),
};

const mockStompService = {
  // Add mock methods or properties of the StompService as needed
};

describe('CartComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        CartComponent
      ],
      providers: [
        // Add your providers here
        { provide: Store, useValue: mockStore },
        // Provide a mock ActivatedRoute
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map().set('id', '123') // You can customize this to match your route snapshot
            }
          }
        },
        { provide: StompService, useValue: mockStompService }, // Provide the mock StompService
      ],


      // Your TestBed configuration goes here
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // Add more tests as needed
});
