import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { MenuItem } from '../model/menu-item.model'; 
import { CurrencyPipe, CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { CartService } from '../../cart/services/cart.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],  
  standalone: true,      
  imports: [CurrencyPipe, CommonModule, FormsModule, HeaderComponent, FooterComponent]
})

 export class MenuListComponent implements OnInit {
  menuItems: MenuItem[] = [];

 @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  categories: any[] = [];
  dietaryPreferences: any[] = [];

  selectedCategories: string[] = [];
  selectedDiets: string[] = [];

  constructor(private menuService: MenuService, private cartService: CartService) {}

  ngOnInit(): void {
    this.menuService.getCategories().subscribe(data => this.categories = data);
    this.menuService.getDietaryPreferences().subscribe(data => this.dietaryPreferences = data);
    this.applyFilters();
  }

  // Sidebar filters
  onCategoryChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(value);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== value);
    }
    this.applyFilters();
  }

  onDietChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedDiets.push(value);
    } else {
      this.selectedDiets = this.selectedDiets.filter(d => d !== value);
    }
    this.applyFilters();
  }

  // Load menu items with filters
  applyFilters() {    
    this.menuService.getFilteredMenu(this.selectedCategories, this.selectedDiets)
      .subscribe({
        next: (response) => {
          this.menuItems = response.data.map(item => ({ ...item, quantity: 1 }));
          console.log('Filtered API response:', response);
        },
        error: (err) => console.error('Error loading menu', err)
      });
  }

  // Quantity controls
  increaseQuantity(item: any): void {
    if (item.quantity < 50) {
      item.quantity++;
    }
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  // Add to cart
  addToCart(item: any): void {
    console.log('Item object:', item);

    const foodItemId = item.foodItemID || item.id || item.foodItemId;

    if (!foodItemId) {
      console.error('foodItemId is missing for item:', item);
      alert('Failed to add item: missing ID');
      return;
    }
      
    this.cartService.addItem(foodItemId, item.quantity).subscribe({
      next: (res) => {
        console.log(' Item added successfully', res);
        // alert(`Added ${item.quantity} x ${item.foodItemName} to cart!`);
        this.headerComponent.showCartNotification(`Added ${item.quantity} x ${item.foodItemName} to cart!`);
        // Refresh cart view
        this.cartService.getCart().subscribe(cart => {
          console.log('🛒 Updated cart:', cart);
        });
      },
      error: (err) => {
        console.error('Failed to add item', err);
        alert('Failed to add item.');
      }
      
    });
  }
}








