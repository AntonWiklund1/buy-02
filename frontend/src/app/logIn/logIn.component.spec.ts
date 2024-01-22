import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { LogInComponent } from './logIn.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { MediaService } from '../services/media.service';

// Mock implementations for services
class MockUserService {
  logIn = jasmine.createSpy('logIn').and.returnValue(of({}));
  getUser = jasmine.createSpy('getUser').and.returnValue(of({}));
  createUser = jasmine.createSpy('createUser').and.returnValue(of({}));
  // Add other methods as necessary
}

class MockAuthService {
  getJwtToken = jasmine.createSpy('getJwtToken').and.returnValue(of({}));
}

class MockMediaService {
  uploadAvatar = jasmine.createSpy('uploadAvatar').and.returnValue(of({}));
}

describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        StoreModule.forRoot({}, {})
      ],
      declarations: [LogInComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MediaService, useClass: MockMediaService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests can be added here to test other functionalities
});
