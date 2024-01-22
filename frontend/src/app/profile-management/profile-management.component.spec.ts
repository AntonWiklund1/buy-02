import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { ProfileManagementComponent } from './profile-managment.component'; // Ensure this is the correct path and file name
import { of } from 'rxjs';
import { UserService } from '../services/user.service';
import { MediaService } from '../services/media.service';

// Import your reducers
import { authReducer } from '../state/auth/auth.reducer';
import { avatarReducer } from '../state/avatar/profile.reducer';

// Mock implementations for services
class MockUserService {
  logIn = jasmine.createSpy('logIn').and.returnValue(of({}));
  getUser = jasmine.createSpy('getUser').and.returnValue(of({}));
  createUser = jasmine.createSpy('createUser').and.returnValue(of({}));
}

class MockMediaService {
  uploadAvatar = jasmine.createSpy('uploadAvatar').and.returnValue(of({}));
}

// Combine the reducers into an object
export const reducers = {
  auth: authReducer,
  avatar: avatarReducer
};

// Mock any metaReducers if you have them, or provide an empty array if you don't
export const metaReducers = [];

describe('ProfileManagementComponent', () => {
  let component: ProfileManagementComponent;
  let fixture: ComponentFixture<ProfileManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileManagementComponent],
      imports: [
        HttpClientModule,
        StoreModule.forRoot(reducers, { metaReducers }) // Provide the combined reducers and metaReducers here
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: MediaService, useClass: MockMediaService },
        // Add any other providers that might be required
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests here
});
