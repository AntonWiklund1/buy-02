import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Import your NgRx actions and selectors
import * as fromAuth from './state/auth/auth.selector';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, HomeComponent, NavBarComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        provideMockStore({
          selectors: [
            { selector: fromAuth.selectToken, value: 'mocked-token' }, // Mock your selector here
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    // Add some debugging output to check the value of the selector
    console.log('Mocked Token:', fromAuth.selectToken);

    // Also, log the state to see if it's initialized correctly
    store.overrideSelector(fromAuth.selectToken, 'mocked-token'); // Ensure the selector matches the mock store
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    expect(component.title).toEqual('Buy');
  });
});
