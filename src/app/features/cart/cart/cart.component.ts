import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: any[] = [];
  totalPrice: number = 0;
  itemCount: number = 0;
  isVisible: boolean = false;
  notification: string | null = null;

  constructor(private cartService: CartService) {}

  openCart(): void {
    this.isVisible = true;
    this.loadCart();
  }

  closeCart(): void {
    this.isVisible = false;
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items.map((i: any) => ({
          foodItemID: i.foodItemID,   
          foodItemName: i.foodItemName,
          price: i.price,
          quantity: i.quantity,
          finalPrice: i.finalPrice
        }));
        this.updateCounts();
      },
      error: () => this.showNotification("Failed to load cart")
    });
  }

  addItem(foodItemId: number, qty: number = 1): void {
    this.cartService.addItem(foodItemId, qty).subscribe({
      next: () => {
        this.showNotification("Item Added Successfully!");
        this.loadCart();
      },
      error: () => this.showNotification("Failed to add item.")
    });
  }

  increaseQuantity(item: any): void {
    const newQty = item.quantity + 1;
    item.quantity = newQty;
    this.updateCounts();
    this.showNotification("Cart Updated");
    this.cartService.updateItem(item.foodItemID, newQty).subscribe({
      next: () => this.loadCart(),
      error: () => this.showNotification("Failed to update quantity.")
    });
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      item.quantity = newQty;
      this.updateCounts();
      this.showNotification("Cart Updated");
      this.cartService.updateItem(item.foodItemID, newQty).subscribe({
        next: () => this.loadCart(),
        error: () => this.showNotification("Failed to update quantity.")
      });
    }
  }

  removeItem(item: any): void {
    this.cartService.removeItem(item.foodItemID).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(i => i.foodItemID !== item.foodItemID);
        this.updateCounts();
        this.showNotification("Item removed");
        this.loadCart();
      },
      error: () => this.showNotification("Failed to remove item.")
    });
  }

  updateCounts(): void {
    this.totalPrice = this.cartItems.reduce((sum, i) => sum + i.finalPrice, 0);
    this.itemCount = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
  }

  checkout(): void {
    this.cartService.checkout(this.cartItems).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.cartItems = [];
        this.updateCounts();
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





