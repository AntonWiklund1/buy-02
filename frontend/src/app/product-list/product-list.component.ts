import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';

import { Store } from '@ngrx/store';
import { AuthState } from '../state/auth/auth.reducer';
import * as AuthSelectors from '../state/auth/auth.selector';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products: any[] | undefined;
  productMediaUrls: Map<string, string> = new Map(); // Map to store media URLs

  token: string | null | undefined;

  constructor(
    private store: Store<{ auth: AuthState, avatar: any }>,
    private productService: ProductService,
    private MediaService: MediaService
  ) {
    this.store.select(AuthSelectors.selectToken).pipe(take(1)).subscribe(token => this.token = token);
  }

  ngOnInit(): void {
    this.productService.getProducts(this.token || '').subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error(error);
      }
    );

    this.loadProducts();
  }
  toggleDescription(product: any) {
    product.isReadMore = !product.isReadMore;
    product.isExpanded = !product.isExpanded; // Toggle the expanded state
  }

  loadProducts(): void {
    this.productService.getProducts(this.token || '').subscribe(
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
  }

  getMediaUrl(productId: string): string | undefined {
    return this.productMediaUrls.get(productId);
  }
}
