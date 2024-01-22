import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { NavBarComponent } from './nav-bar.component';
import { MediaService } from '../services/media.service';
import { of } from 'rxjs';

// Mock implementations for services
class MockMediaService {
  getAvatar = jasmine.createSpy('getAvatar').and.returnValue(of('/assets/images/default-avatar.png'));
}

// Provide a basic mock for the AuthState
function mockAuthReducer(state: any, action: any) {
  // Implement mock reducer logic if needed, or return a default state
  return state;
}

// Provide a basic mock for the AvatarState
function mockAvatarReducer(state: any, action: any) {
  // Implement mock reducer logic if needed, or return a default state
  return state;
}

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({
          auth: mockAuthReducer,
          avatar: mockAvatarReducer
        }),
      ],
      declarations: [NavBarComponent],
      providers: [
        { provide: MediaService, useClass: MockMediaService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests here
});
