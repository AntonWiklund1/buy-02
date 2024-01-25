import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { MediaService } from '../services/media.service';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
} from '../state/auth/auth.actions';
import { AuthState } from '../state/auth/auth.reducer';
import { selectAuthState } from '../state/auth/auth.selector';

@Component({
  selector: 'app-logIn',
  templateUrl: './logIn.component.html',
  styleUrls: ['./logIn.component.css'],
})
export class LogInComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  userRole: string = '';
  signUp: boolean = false;
  logIn: boolean = true;
  isSeller: boolean = false;
  token: any;
  userId: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private mediaService: MediaService,
    private store: Store<{ auth: AuthState }>
  ) { }

  showEmail() {
    return this.signUp;
  }
  hideLogIn() {
    return this.signUp;
  }
  goLogIn() {
    this.signUp = false;
    this.logIn = true;
    this.isSeller = false;
    return this.logIn;
  }
  showLogIn() {
    return this.logIn;
  }
  showSignUp() {
    return this.signUp;
  }
  goSignUp() {
    this.logIn = false;
    this.signUp = true;

    return this.signUp;
  }

  validatePassword() {
    var password = (<HTMLInputElement>document.getElementById('password'))
      .value;
    var confirmPassword = (<HTMLInputElement>(
      document.getElementById('confirmPassword')
    )).value;
    if (password.length == 0 && confirmPassword.length == 0) {
      return false;
    } else if (password != confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    return true;
  }

  validateForm() {
    // Check if the password validation is successful
    if (this.validatePassword()) {
      // Use the authService to get the JWT token
      var role = 'admin';
      var jwtPassword = 'password';

      this.authService.getJwtToken(role, jwtPassword).subscribe({
        next: (jwtToken: any) => {
          const bearer = Object.values(jwtToken)[1] as string;

          role = this.isSeller ? 'ROLE_SELLER' : 'ROLE_CLIENT';
          // Assuming you want to use the JWT token immediately to create a user
          const newUser = {
            id: this.username,
            name: this.username,
            password: this.password,
            email: this.email,
            role: role,
          };

          // Call the userService to create a new user
          // Make sure to include the JWT token in your request if needed
          this.userService
            .createUser(newUser, bearer || '')
            .subscribe({
              next: (response: any) => {


                this.token = bearer;
                this.userId = newUser.id;

                const fileInput = document.getElementById(
                  'mediaUpload'
                ) as HTMLInputElement;
                if (
                  fileInput &&
                  fileInput.files &&
                  fileInput.files.length > 0
                ) {
                  const file = fileInput.files[0]; // Access the first file in the files list


                  this.mediaService
                    .uploadAvatar(file, this.userId, bearer)
                    .subscribe(
                      () => {
                        console.log('Profile picture updated successfully');
                      },
                      (error: { status: number }) => {

                        if (error.status === 413) {
                          this.errorMessage =
                            'The file is too large to upload.';
                        } else if (error.status === 415) {
                          this.errorMessage = 'The file type is not supported.';
                        }
                        console.error('Update profile picture error:', error);
                      }
                    );
                }
                // Handle response upon successful user creation
                // Navigate to the desired route upon success
                this.router.navigate(['/cart']);
              },
              error: (userError: { error: string }) => {
                this.errorMessage = userError.error;
                console.error('Error creating user', userError);
              },
            });
        },
        error: (error: any) => {
          console.error('Error obtaining JWT token', error);
        },
      });
      return true;
    } else {
      return false;
    }
  }
  //log in
  LogIn() {
    const user = {
      username: this.username,
      password: this.password,
    };

    // Dispatch a login action
    this.store.dispatch(login(user));

    this.userService.logIn(user).subscribe({
      next: (response: any) => {
        console.log('User logged in');
        this.token = response.token;
        this.userId = response.userId;

        // Call getRole and pass a callback function for navigation
        this.getRole(response.userId, response.token, () => {
          this.router.navigate(['/cart']); // Navigate after role is set
        });

      },
      error: (error: any) => {
        // Dispatch a loginFailure action
        this.store.dispatch(loginFailure({ error: error.message }));
        this.errorMessage = 'Username or password is incorrect';
      },
    });
  }

  getRole(userId: string, token: string, onRoleRetrieved: () => void) {
    this.userService.getUser(userId, token).subscribe({
      next: (userProfile: any) => {
        this.userRole = userProfile.role;

        // Dispatch loginSuccess here, after the role has been retrieved
        this.store.dispatch(loginSuccess({
          userId: userId,
          username: this.username,
          token: token,
          role: this.userRole
        }));

        onRoleRetrieved(); // Call the callback function to navigate
      },
      error: (userError: any) => {
        console.error(userError);
        this.errorMessage = userError.error.message;
      },
    });
  }


  // File upload
  selectedFileName: string = '';

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    this.selectedFileName = fileInput.files?.[0]?.name || '';
    // Add additional logic if needed
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('mediaUpload');
    if (fileInput) {
      fileInput.click();
    }
  }
}
