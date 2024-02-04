import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../services/user.service';
import { MediaService } from '../services/media.service';
import * as AuthSelectors from '../state/auth/auth.selector';
import * as AvatarSelectors from '../state/avatar/profile.selector';
import * as AvatarActions from '../state/avatar/profile.actions';
import { Observable, catchError, map, of, switchMap, take } from 'rxjs';
import * as AuthActions from '../state/auth/auth.actions';
import { selectUserRole } from '../state/auth/auth.selector';
import { AppState } from '../state/app.state';

interface Profile {
  name: string;
  email: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.css'],
})
export class ProfileManagementComponent implements OnInit {
  confirmDeleteProfile: boolean = false;
  avatarUrl: string = 'assets/images/default-avatar.png';
  avatarUrl$: Observable<string>; // Observable for the avatar URL
  isAdmin$: Observable<boolean>;

  confirmedProfilePicChange: boolean = false;
  errorMessage: string = '';
  userId: string | null | undefined;
  token: string | null | undefined;
  username: string | null | undefined;

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private router: Router,
    private mediaService: MediaService
  ) {
    this.store.select(AuthSelectors.selectUserId).pipe(take(1)).subscribe(id => this.userId = id);
    this.store.select(AuthSelectors.selectToken).pipe(take(1)).subscribe(token => this.token = token);
    this.store.select(AuthSelectors.selectUsername).pipe(take(1)).subscribe(username => this.username = username);

    this.avatarUrl$ = this.store.select(AvatarSelectors.selectAvatarUrl);

    //return true if the user is a seller and false if not
    this.isAdmin$ = this.store.select(selectUserRole).pipe(
      map(role => role === 'ROLE_SELLER')
    );

  }

  ngOnInit(): void {
    if (this.userId && this.token && this.username && this.avatarUrl && this.isAdmin$) {
      this.loadUserAvatar();
    }
  }

  private loadUserAvatar(): void {
    this.store.select(AuthSelectors.selectUserId).pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          console.error('User ID is missing');
          // Return the path to the image in the assets folder
          return of('/assets/images/default-avatar.png');
        }
        return this.store.select(AuthSelectors.selectToken).pipe(
          take(1),
          switchMap(token => {
            if (!token) {
              console.error('Token is missing');
              // Return the path to the image in the assets folder
              return of('/assets/images/default-avatar.png');
            }
            return this.mediaService.getAvatar(userId, token);
          }),
          catchError(error => {
            console.error('Error loading user avatar:', error);
            // Return the path to the image in the assets folder
            return of('/assets/images/default-avatar.png');
          })
        );
      })
    ).subscribe(avatarPath => {
      // Check if avatarPath is a full URL or a relative path
      let avatarUrl = avatarPath;
      if (!avatarPath.startsWith('http') && !avatarPath.startsWith('/assets')) {
        // If avatarPath is neither a full URL nor an asset path, assume it's a relative path from the server
        avatarUrl = `https://localhost:8443/${avatarPath}`;
      }
      // Dispatch the action with the correct URL
      this.store.dispatch(AvatarActions.updateProfilePicture({ url: avatarUrl }));
      console.log('User avatar retrieved successfully', avatarUrl);
    });
  }


  deleteProfile(): void {
    if (this.userId && this.token) {
      this.userService.deleteProfile(this.userId, this.token).subscribe({
        next: () => {
          console.log('Profile deleted successfully');
          localStorage.clear();
          this.router.navigate(['/logIn']);
        },
        error: (error: any) => console.error('Delete profile error:', error)
      });
    }
  }

  toggleConfirmDelete(): void {
    this.confirmDeleteProfile = !this.confirmDeleteProfile;
  }

  checkDelete(): void {
    this.toggleConfirmDelete();
  }

  showDelete(): boolean {
    return this.confirmDeleteProfile;
  }

  editProfile(): void {
    const newProfile: Profile = {
      name: this.getInputValue('newName'),
      email: this.getInputValue('newEmail'),
      password: this.getInputValue('newPassword'),
      role: this.getInputValue('newRole'),
    };

  if (this.userId && this.token) {
    this.userService.updateProfile(this.userId, newProfile, this.token).subscribe({
      next: () => {
        console.log('Profile updated successfully');
        this.username = newProfile.name;
  
        // Dispatch the updateProfileSuccess action
        this.store.dispatch(AuthActions.updateProfileSuccess({
          username: newProfile.name,
          role: newProfile.role
        }));
        this.store.dispatch(AuthActions.logout());
      },
      error: (error: any) => console.error('Update profile error:', error)
    });
  }
}

  editProfilePicture(): void {
    const userId = this.userId;
    const token = this.token;

    if (userId && token) {
      const fileInput = document.getElementById('newProfilePicture') as HTMLInputElement;

      if (!fileInput?.files?.length) {
        this.errorMessage = 'No file selected for upload.';
        return;
      }

      const file = fileInput.files[0];
      this.mediaService.uploadAvatar(file, userId, token).subscribe({
        next: (response) => {
          const newAvatarUrl = `https://localhost:8443/${response}`;
          this.store.dispatch(AvatarActions.updateProfilePicture({ url: newAvatarUrl }));
          console.log('Profile picture updated successfully');
          this.ngOnInit();
          this.errorMessage = ''; // Clear any previous error message
        },
        error: (error) => {
          this.handleProfilePictureUploadError(error);
        }
      });
    } else {
      this.errorMessage = 'Authentication required.';
    }
  }


  private getInputValue(elementId: string): string {
    return (document.getElementById(elementId) as HTMLInputElement).value;
  }

  private handleProfilePictureUploadError(error: any): void {
    if (error.status === 413) {
      this.errorMessage = 'The file is too large to upload.';
    } else if (error.status === 415) {
      this.errorMessage = 'The file type is not supported.';
    } else {
      this.errorMessage = 'An error occurred while updating the profile picture.';
    }
    console.error('Update profile picture error:', error);
  }
}
