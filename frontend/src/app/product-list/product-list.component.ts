import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { MediaService } from '../services/media.service';

import { Store } from '@ngrx/store';
import { AuthState } from '../state/auth/auth.reducer';
import * as AuthSelectors from '../state/auth/auth.selector';
import { take } from 'rxjs/operators';

import { OrderService } from '../services/order.service';
import { selectOrderId } from '../state/cart/cart.selectors';
import { Observable } from 'rxjs';
import { CartState } from '../state/cart/cart.reducer';
import { AppState } from '../state/app.state';

import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products: any[] | undefined;
  filteredProducts: any[] | undefined; // Array to hold the filtered products
  searchText: string = ''; // Initialize searchText
  productMediaUrls: Map<string, string> = new Map(); // Map to store media URLs

  token: string | null | undefined;

  orderId$: Observable<string | null>;
  orderId: string | null = null; // You will use this in addToCart

  userId$: Observable<string | null>;
  userId: string | null = null;

  filterInStockOnly: boolean = false; // Add this line

  minPrice: number | null = null;
  maxPrice: number | null = null;

  sortByPriceAscending: boolean = true; // Add this property



  constructor(
    private store: Store<AppState>, // Add cart state if it's not already included
    public productService: ProductService,
    private MediaService: MediaService,
    private orderService: OrderService,
    private snackBar: MatSnackBar 


  ) {
    this.orderId$ = this.store.select(selectOrderId);

    this.store
      .select(AuthSelectors.selectToken)
      .pipe(take(1))
      .subscribe((token) => (this.token = token));

    this.userId$ = this.store.select(AuthSelectors.selectUserId);
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
    this.orderId$.pipe(take(1)).subscribe((currentOrderId) => {
      this.orderId = currentOrderId; // Store the orderId for later use
    });

    this.userId$.pipe(take(1)).subscribe((id) => {
      this.userId = id;
    });

  }

  toggleDescription(product: any) {
    product.isReadMore = !product.isReadMore;
    product.isExpanded = !product.isExpanded; // Toggle the expanded state
  }

  search(): void {
    if (!this.products) {
      return;
    }
    
    let tempFilteredProducts = this.products.filter(product => {
      // Apply in-stock filter if needed
      const inStock = !this.filterInStockOnly || product.quantity > 0;

      // Apply price range filter
      const inPriceRange = (!this.minPrice || product.price >= this.minPrice) &&
                           (!this.maxPrice || product.price <= this.maxPrice);

      return inStock && inPriceRange;
    });

    if (this.searchText.trim() !== '') {
      tempFilteredProducts = tempFilteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.filteredProducts = tempFilteredProducts;
    this.filteredProducts = tempFilteredProducts.sort((a, b) => a.price - b.price);
    
    if (!this.sortByPriceAscending) {
      this.filteredProducts = this.filteredProducts.reverse();
    }
  }

  toggleInStockFilter(): void {
    this.filterInStockOnly = !this.filterInStockOnly;
    this.search(); // Reapply search and filter
  }

  toggleSortByPrice(): void {
    this.sortByPriceAscending = !this.sortByPriceAscending;
    this.search(); // Reapply search to reflect new sort order
  }
  

  loadProducts(): void {
    this.productService.getProducts(this.token || '').subscribe(
      (products) => {
        this.products = products.map((product: any) => ({
          ...product,
          isReadMore: true, // Add this line for each product
        }));
        this.filteredProducts = this.products; // Set filteredProducts to all products
        this.preloadMediaForProducts(products);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  preloadMediaForProducts(products: any[]): void {
    const backendUrl = 'https://localhost:8443/'; // Adjust this URL to where your backend serves media files
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

  addToCart(productId: string): void {
    console.log('Add to cart');
    console.log(this.orderId);

    if (!this.userId) {
      console.error('No user ID available');
      alert('Please log in to add products to your cart');
      return;
    }

    this.orderService.addProductToCart(this.userId, productId).subscribe({
      next: () => {
        this.showNotification('Product added to cart');
      },
      error: (error) => {
        console.error(`Error adding product to order: ${error}`);
      }
    });
  }
  addtoFavorite(productId: string): void {
    
    if (!this.userId) {
      console.error('No user ID available');
      alert('Please log in to add products to your favorite');
      return;
    }

    this.productService.addProductToFavorite(this.userId, productId).subscribe({
      next: () => {
        this.showNotification('Product added to favorite');
      },
      error: (error) => {
        console.error(`Error adding product to favorite: ${error}`);
      }
    });
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      panelClass: 'custom-snackbar',
      duration: 3000,
      verticalPosition: 'top', // This positions the snackbar at the top of the screen
      horizontalPosition: 'center', // This centers the snackbar horizontally
    });    
  }
}
