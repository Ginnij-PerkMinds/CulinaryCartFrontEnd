import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { CartResponseDto } from '../../cart/services/cart-response.dto';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
   cartResponse: CartResponseDto = {
    items: [],
    baseAmount: 0,
    promoDiscount: 0,
    charges: [],
    finalAmount: 0,
    appliedPromoCode: '',
    message: ''
  };

  itemCount: number = 0; 
  isVisible: boolean = false;
  notification: string | null = null;
  promoCode: string = '';

  constructor(private cartService: CartService) {}

  openCart(): void {
    this.isVisible = true;
    this.loadCart();
  }

  closeCart(): void {
    this.isVisible = false;
  }

  loadCart(promoCode?: string): void {
    this.cartService.getCart(promoCode).subscribe({
      next: (response) => {
        this.cartResponse = response;
        this.itemCount = response.items.reduce((sum, i) => sum + i.quantity, 0);
      },
      error: () => this.showNotification("Failed to load cart")
    });
  }

  addItem(foodItemId: number, qty: number = 1): void {
    this.cartService.addItem(foodItemId, qty).subscribe({
      next: () => {
        this.showNotification("Item Added Successfully!");
        this.loadCart(this.promoCode);
      },
      error: () => this.showNotification("Failed to add item.")
    });
  }

  updateItem(foodItemId: number, qty: number): void {
    this.cartService.updateItem(foodItemId, qty).subscribe({
      next: () => this.loadCart(this.promoCode),
      error: () => this.showNotification("Failed to update quantity.")
    });
  }

  removeItem(foodItemId: number): void {
    this.cartService.removeItem(foodItemId).subscribe({
      next: () => {
        this.showNotification("Item removed");
        this.loadCart(this.promoCode);
      },
      error: () => this.showNotification("Failed to remove item.")
    });
  }

  cancelPromo() {
  this.promoCode = '';
  this.loadCart(); // reload cart without promo
}

  checkout(): void {
    this.cartService.checkout(this.promoCode).subscribe({
      next: (response) => {
        alert('Order placed successfully!');
        this.cartResponse = {
          items: [],
          baseAmount: 0,
          promoDiscount: 0,
          charges: [],
          finalAmount: 0,
          appliedPromoCode: '',
          message: ''
        };
        this.itemCount = 0;
        this.closeCart();
      },
      error: () => this.showNotification("Checkout failed.")
    });
  }

  showNotification(message: string): void {
    this.notification = message;
    setTimeout(() => this.notification = null, 5000);
  }
}