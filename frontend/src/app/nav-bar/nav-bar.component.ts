import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../state/auth/auth.reducer';
import { selectIsAuthenticated, selectUserRole, selectUsername } from '../state/auth/auth.selector';
import { logout } from '../state/auth/auth.actions';
import { Observable, switchMap, catchError, of, take } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as AuthSelectors from '../state/auth/auth.selector';
import * as AvatarSelectors from '../state/avatar/profile.selector';
import { AppState } from '../state/app.state';
import * as AvatarActions from '../state/avatar/profile.actions';
import { MediaService } from '../services/media.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  username$: Observable<string>;
  avatarUrl$: Observable<string>; // Observable for the avatar URL
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private store: Store<{ auth: AuthState; avatar: any; }>,
    private mediaService: MediaService
  ) {

    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.isAdmin$ = this.store.select(selectUserRole).pipe(
      map(role => role === 'ROLE_SELLER')
    );
    this.username$ = this.store.select(selectUsername).pipe(
      map(username => username ?? '') // If username is null, use empty string as a default
    );

    this.avatarUrl$ = this.store.select(AvatarSelectors.selectAvatarUrl);
  }

  ngOnInit(): void {
    this.store.select(selectIsAuthenticated).pipe(
      takeUntil(this.destroy$)
    ).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadUserAvatar();  // Load avatar when the user is authenticated
      } else {
        this.router.navigate(['/logIn']);
      }
    });
  }
  private loadUserAvatar(): void {
    this.store.select(AuthSelectors.selectUserId).pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          // Return the path to the image in the assets folder
          return of('/assets/images/default-avatar.png');
        }
        return this.store.select(AuthSelectors.selectToken).pipe(
          take(1),
          switchMap(token => {
            if (!token) {
              alert('Token is missing try to log in again');
              // Return the path to the image in the assets folder
              return of('/assets/images/default-avatar.png');
            }
            return this.mediaService.getAvatar(userId, token);
          }),
          catchError(error => {

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
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logOut(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/logIn']);
  }
}
