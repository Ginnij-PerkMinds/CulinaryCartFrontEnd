import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AdminService } from '../services/admin.service';
import { MenuItem, MenuResponse } from '../../admin/model/admin.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, HeaderComponent, FooterComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  menuItems: MenuItem[] = [];
  categories: any[] = [];
  dietaryPreferences: any[] = [];

  selectedCategory: string = '';
  selectedDiet: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // Fetch categories and diets from DB
    this.adminService.getCategories().subscribe(data => this.categories = data);
    this.adminService.getDietaryPreferences().subscribe(data => this.dietaryPreferences = data);

    // Load menu items initially
    this.applyFilters();
  }

  // Dropdown filters
  applyCategoryFilter(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyDietFilter(diet: string) {
    this.selectedDiet = diet;
    this.applyFilters();
  }

  // Fetch menu items with filters applied
  applyFilters() {
    const categories = this.selectedCategory ? [this.selectedCategory] : [];
    const diets = this.selectedDiet ? [this.selectedDiet] : [];

    this.adminService.getFilteredMenu(categories, diets)
      .subscribe({
        next: (response: MenuResponse) => {
          if (response && response.data) {
            this.menuItems = response.data.map(item => ({ ...item, quantity: 1 }));
          } else {
            this.menuItems = [];
          }
          console.log('Admin API response:', response);
        },
        error: (err) => console.error('Error loading menu in AdminComponent', err)
      });
  }
  
  // Admin actions
  viewItem(item: any) {
    alert(`Viewing: ${item.foodItemName}`);
  }

  updateItem(item: any) {
    alert(`Updating: ${item.foodItemName}`);
    
  }

  deleteItem(item: any) {
    if (confirm(`Delete ${item.foodItemName}?`)) {
      this.adminService.deleteMenuItem(item.foodItemID).subscribe(() => {
        this.menuItems = this.menuItems.filter(f => f.foodItemID !== item.foodItemID);
        alert(`${item.foodItemName} deleted`);
      });
    }
  }
}









