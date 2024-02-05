import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerProfileComponent } from './buyer-profile.component';

import { StoreModule, Store } from '@ngrx/store';


describe('BuyerProfileComponent', () => {
  let component: BuyerProfileComponent;
  let fixture: ComponentFixture<BuyerProfileComponent>;

  let store: Store;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // Import the StoreModule with a mock reducer or the actual one if needed
        StoreModule.forRoot({}), // or use StoreModule.forFeature if it's a feature store
      ],
      declarations: [BuyerProfileComponent],
      // Provide a mock store or use the actual Store, depending on your test
      providers: [
        {
          provide: Store,
          useValue: {
            // Mock the methods that are used by your component
            // ... any other methods needed
          },
        },
      ],
    });

    store = TestBed.inject(Store);
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
