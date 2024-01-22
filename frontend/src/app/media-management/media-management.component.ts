import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../state/auth/auth.selector';
import { AuthState } from '../state/auth/auth.reducer';
import { MediaService } from '../services/media.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

// Component decorator with selector, template, and style information
@Component({
  selector: 'app-media-management',
  templateUrl: './media-management.component.html',
  styleUrls: ['./media-management.component.css'],
})

// MediaManagementComponent manages the media assets for an admin user
export class MediaManagementComponent implements OnInit {
  // State observables for the current user
  username$: Observable<string | null>;
  userId$: Observable<string | null>;
  token$: Observable<string | null>;

  // User state variables
  userId: string | null | undefined;
  token: string | null | undefined;
  username: string | null | undefined;

  // Array to keep track of all media items associated with products
  allMedia: { productId: string; mediaUrl: string }[] = [];

  // Flags to control UI elements for editing and deleting media
  showEdit = false;
  showDelete = false;

  // Variables to hold IDs for edit and delete operations
  currentEditMediaId: string | null = null;
  currentDeleteMedia: string | null = null;


  errorMessage: string | null = null;
  // Injecting required services and state management
  constructor(
    private router: Router,
    private store: Store<{ auth: AuthState }>,
    private mediaService: MediaService,
    private productService: ProductService
  ) {
    // Initialize state observables from the store
    this.username$ = this.store.select(AuthSelectors.selectUsername);
    this.userId$ = this.store.select(AuthSelectors.selectUserId);
    this.token$ = this.store.select(AuthSelectors.selectToken);
  }

  // OnInit lifecycle hook for initial component setup
  ngOnInit(): void {
    // Subscribe to user details from the state management and initialize local variables
    this.userId$.pipe(take(1)).subscribe((id) => this.userId = id);
    this.token$.pipe(take(1)).subscribe((token) => this.token = token);
    this.username$.pipe(take(1)).subscribe((username) => this.username = username);

    // Fetch products associated with the user after initialization
    this.getProductsByUserId(this.userId || '');
  }

  // Refreshes the media list by clearing and fetching the latest media items
  refreshMediaList(): void {
    this.allMedia = []; // Clear current media list
    this.getProductsByUserId(this.userId || ''); // Fetch new media items
  }

  // Retrieves products associated with a user ID and fetches their media
  getProductsByUserId(userId: string) {

    this.productService.getProductsByUserId(userId).subscribe((products) => {
      products.forEach((product: { id: string; }) => {
        this.getMediaByProductId(product.id);
      });
    });
  }

  // Retrieves media by product ID and updates the media list
  getMediaByProductId(productId: string) {

    this.allMedia = []; // Clear current media list
    this.mediaService.getMediaByProductId(productId, this.token || '').subscribe((mediaUrls) => {
      const mediaObjects = mediaUrls.map(url => ({ productId, mediaUrl: url }));
      this.allMedia.push(...mediaObjects);
      this.allMedia.sort((a, b) => a.productId.localeCompare(b.productId)); // Sort media items
    });
  }

  // Toggles the edit state and sets the current media ID for editing
  toggleEdit(mediaId?: string): void {
    this.showEdit = !this.showEdit;
    this.currentEditMediaId = mediaId || null;
  }

  // Toggles the delete state and sets the current media ID for deletion
  toggleDelete(mediaId?: string): void {
    this.showDelete = !this.showDelete;
    this.currentDeleteMedia = mediaId || null;
  }

  // Handles the media upload process after editing
  submitEditMedia() {
    const newFileInput = document.getElementById('file') as HTMLInputElement;
    const file = newFileInput.files?.item(0);

    if (file) {
      this.mediaService.uploadMedia(file, this.currentEditMediaId || '', this.token || '').subscribe((res) => {
        //timeout to wait for the file to be uploaded
        setTimeout(() => {
          this.refreshMediaList(); // Refresh media list after upload
          this.showEdit = false; // Hide edit form
        }, 500);
      }, (error) => {
        this.errorMessage = error.message;
        console.error('Error:', error);
      }
      );

    }
  }

  // Handles the media deletion process
  submitDeleteMedia() {
    this.mediaService.deleteMedia(this.currentDeleteMedia || '', this.token || '').subscribe((res) => {
      this.allMedia = this.allMedia.filter(media => media.productId !== this.currentDeleteMedia); // Remove deleted media from the list
      this.currentDeleteMedia = null; // Reset delete media ID
      this.showDelete = false; // Hide delete confirmation
    }, (error) => {
      console.error('Error:', error);
    });
  }

}
