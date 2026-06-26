import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,   
  imports: [CommonModule, FormsModule, CurrencyPipe], 
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
  categories: any[] = [];
  dietaryPreferences: any[] = [];
  menuItems: any[] = [];
  allmenuItems: any[] = [];

  selectedCategory: string = '';
  selectedDiet: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Category load error:', err)
    });

    this.adminService.getDietaryPreferences().subscribe({
      next: (data) => this.dietaryPreferences = data,
      error: (err) => console.error('Diet options load error:', err)
    });
    
    this.loadMenu();
  }

  loadMenu(): void {
    this.adminService.getFilteredMenu(this.selectedCategory, this.selectedDiet).subscribe({
      next: (res) => {
        //Both arrays must sync simultaneously on data pull
        this.menuItems = res.data;
        this.allmenuItems = [...res.data]; 
      },
      error: (err) => console.error('Menu grid pull error:', err)
    });
  }

  applyCategoryFilter(category: string): void {
    this.selectedCategory = category;
    this.loadMenu();
  }

  applyDietFilter(diet: string): void {
    this.selectedDiet = diet;
    this.loadMenu();
  }

  viewItem(item: any): void {
    console.log('Premium View Activation Context triggered:', item);
  }

  updateItem(item: any): void {
    console.log('Premium Modify Activation Context triggered:', item);
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to completely remove this dish from the active kitchen loop?')) {
      this.adminService.deleteMenuItem(id).subscribe({
        next: () => {
          this.menuItems = this.menuItems.filter(m => m.foodItemID !== id);
          this.allmenuItems = this.allmenuItems.filter(m => m.foodItemID !== id);
        },
        error: (err) => console.error('Failed to purge product record:', err)
      });
    }
  }

  searchItems(query: string): void {
    const searchString = query ? query.trim().toLowerCase() : '';
    if (searchString) {
      this.menuItems = this.allmenuItems.filter(item =>
        item.foodItemName?.toLowerCase().includes(searchString) ||
        item.categoryName?.toLowerCase().includes(searchString) ||
        item.dietaryPreferenceName?.toLowerCase().includes(searchString)
      );
    } else {
      this.menuItems = [...this.allmenuItems]; // Safely resets dataset on backspace wipe
    }
  }
}