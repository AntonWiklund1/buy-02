import { Component, HostListener } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaService } from '../services/media.service';
import * as AuthSelectors from '../state/auth/auth.selector';
import { Observable, take, timeout } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../state/auth/auth.reducer';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent {
  products: any[] | undefined;
  editProducts: any[] | undefined;
  username$: Observable<string | null>;
  userId$: Observable<string | null>;
  token$: Observable<string | null>;
  showProducts: boolean = false;
  showEditProducts: boolean = false;
  showMediaUploads: boolean = false;
  confirmDeleteProduct: boolean = false;
  uploadignMediaToProduct: string = '';
  imagepath: string = '';
  productMediaUrls: Map<string, string> = new Map(); // Map to store media URLs
  errorMessage: string = '';
  userId: string | null | undefined;
  token: string | null | undefined;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private productService: ProductService,
    private MediaService: MediaService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {
    this.username$ = this.store.select(AuthSelectors.selectUsername);
    this.userId$ = this.store.select(AuthSelectors.selectUserId);
    this.token$ = this.store.select(AuthSelectors.selectToken);
  }

  ngOnInit(): void {
    
    this.userId$.pipe(take(1)).subscribe((id) => {
      this.userId = id;
    });

    // Subscribe to the token$ observable to get the latest token
    this.token$.pipe(take(1)).subscribe((token) => {
      this.token = token;
    });

    // closeModal and localStorage.removeItem should be used with caution;
    // Ensure they are called in the right context
    this.closeModal();
    localStorage.removeItem('productId');

    this.userId$.pipe(take(1)).subscribe((userId) => {
      if (userId) {
        this.productService.getProductsByUserId(userId).subscribe(
          (data) => {
            this.products = data;
          },
          (error) => {
            console.log(this.token)
            console.error(error);
          }
        );
        this.loadProducts(userId);
      } else {
        // Handle the case where there is no userId (e.g., user is not logged in)
      }
    });
  }

  toggleDescription(product: any) {
    product.isReadMore = !product.isReadMore;
    product.isExpanded = !product.isExpanded; // Toggle the expanded state
  }

  loadProducts(userId: string): void {
    this.productService.getProductsByUserId(userId).subscribe(
      (products) => {
        this.products = products.map((product: any) => ({
          ...product,
          isReadMore: true, // Add this line for each product
        }));
        this.preloadMediaForProducts(products);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  preloadMediaForProducts(products: any[]): void {
    const backendUrl = 'https://164.90.180.143:8443/'; // Adjust this URL to where your backend serves media files
    products.forEach((product) => {
      this.MediaService.getMedia(product.id).subscribe(
        (mediaDataArray) => {
          if (Array.isArray(mediaDataArray) && mediaDataArray.length > 0) {
            const mediaObject = mediaDataArray[0];
            if (mediaObject && mediaObject.imagePath) {
              const imagePath = `${backendUrl}${mediaObject.imagePath}`;
              this.productMediaUrls.set(product.id, imagePath);
            } else {
              this.productMediaUrls.set(
                product.id,
                'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'
              );
            }
          } else {
            this.productMediaUrls.set(
              product.id,
              'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'
            );
          }
        },
        (error) => {
          console.error(error);
          this.productMediaUrls.set(
            product.id,
            'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'
          );
        }
      );
    });
  };

  getMediaUrl(productId: string): string | undefined {
    return this.productMediaUrls.get(productId);
  }

  addproduct() {


    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.addClass(bakground, 'darkBackground');
    this.showProducts = !this.showProducts;
  }

  createProduct() {


    const newProduct = {
      id: (<HTMLInputElement>document.getElementById('name')).value,
      name: (<HTMLInputElement>document.getElementById('name')).value,
      description: (<HTMLInputElement>document.getElementById('description'))
        .value,
      price: (<HTMLInputElement>document.getElementById('price')).value,
      quantity: (<HTMLInputElement>document.getElementById('quantity')).value,
      userId: this.userId,
    };

    this.productService.addProduct(newProduct, this.token || '').subscribe(
      (data) => {
        const newFileInput = document.getElementById(
          'fileAdd'
        ) as HTMLInputElement;

        if (
          newFileInput &&
          newFileInput.files &&
          newFileInput.files.length > 0
        ) {
          const newFile = newFileInput.files[0];

          const productId = data.productId;
          const bearerToken = this.token || '';

          if (!bearerToken) {
            this.errorMessage = 'Authentication token is missing try logging in again.';
            alert(this.errorMessage);
            return;
          }

          this.MediaService.uploadMedia(newFile, productId, bearerToken).subscribe(
            (data) => {
              // Add timeout on 0.5 seconds to allow for media to be uploaded
              setTimeout(() => {
                this.closeModal();
                this.ngOnInit();
              }, 500);
            },
            (error) => {
              this.closeModal();
              this.router.navigate(['/productManagement']);
              console.error('Upload error media error for new product:', error);
              // Handle the upload error, perhaps by showing an error message to the user.
            }
          );
        } else {
          setTimeout(() => {
            this.closeModal();
            this.ngOnInit();
          }, 500);
        }
      },
      (error) => {
        this.closeModal();
        console.log(newProduct);
        console.error('error for new product', error);
      }
    );
  }

  showProduct() {
    return this.showProducts;
  }

  closeModal() {
    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.removeClass(bakground, 'darkBackground');
    this.showProducts = false;
    this.showEditProducts = false;
    this.showMediaUploads = false;
  }
  showEditProduct() {
    return this.showEditProducts;
  }

  editProduct(id: string) {
    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.addClass(bakground, 'darkBackground');
    this.showEditProducts = !this.showEditProducts;

    this.productService.getProductById(id).subscribe(
      (data) => {
        this.editProducts = Array.isArray(data) ? data : [data];

        console.log(data);
      },
      (error) => {
        console.log(id);
        console.error(error);
      }
    );
  }
  updateProduct(
    id: string,
    name: string,
    description: string,
    price: string,
    quantity: string
  ) {
    const newProduct = {
      name: name,
      description: description,
      price: price,
      quantity: quantity,
      userId: this.userId,
    };


    this.productService.editProduct(id, newProduct, this.token || '').subscribe(
      (data) => {

        this.ngOnInit();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  confirmDelete() {
    this.confirmDeleteProduct = !this.confirmDeleteProduct;
  }
  showDelete() {
    return this.confirmDeleteProduct;
  }
  deleteProduct(id: string) {


    this.productService.deleteProduct(id, this.token || '').subscribe(
      (data) => {
        this.confirmDeleteProduct = false;
        this.ngOnInit();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  showUploadMedia(productId: string) {
    const bakground = this.el.nativeElement.querySelector('.bakground');
    this.renderer.addClass(bakground, 'darkBackground');
    this.showMediaUploads = !this.showMediaUploads;

    localStorage.setItem('productId', productId);
    this.uploadignMediaToProduct = productId;
  }

  uploadMedia() {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const productId = localStorage.getItem('productId') || '';

      if (!productId) {
        this.errorMessage = 'Product ID is missing. Unable to upload media.';
        return;
      }

      this.MediaService.uploadMedia(file, productId, this.token || '').subscribe(
        (data) => {
          setTimeout(() => {
          console.log('Media upload successful');
          this.closeModal();
          this.ngOnInit(); // Refresh the component to reflect changes
          this.errorMessage = '';
          }
          , 500);

        },
        (error) => {
          console.error('Upload error:', error);
          this.handleUploadError(error); // A separate method to handle different types of errors
        }
      );
    } else {
      this.errorMessage = 'No file selected. Please choose a file to upload.';
    }
  }

  private handleUploadError(error: any): void {
    if (error.status === 413) {
      this.errorMessage = 'The file is too large to upload.';
    } else if (error.status === 415) {
      this.errorMessage = 'The file type is not supported.';
    } else {
      this.errorMessage = 'An error occurred during the upload.';
    }
  }

  showMediaUpload() {
    return this.showMediaUploads;
  }
}
