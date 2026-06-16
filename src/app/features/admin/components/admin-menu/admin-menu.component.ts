import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { MenuResponse } from '../../model/admin.model';

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
  allmenuItems:any[]= [];

  selectedCategory: string = '';
  selectedDiet: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getCategories().subscribe(data => this.categories = data);
    this.adminService.getDietaryPreferences().subscribe(data => this.dietaryPreferences = data);
    this.loadMenu();
  }

  loadMenu(): void {
    this.adminService.getFilteredMenu(this.selectedCategory, this.selectedDiet).subscribe(res => {
      this.menuItems = res.data;
    });
  }

  // Fix missing methods
  applyCategoryFilter(category: string): void {
    this.selectedCategory = category;
    this.loadMenu();
  }

  applyDietFilter(diet: string): void {
    this.selectedDiet = diet;
    this.loadMenu();
  }

  viewItem(item: any): void {
    console.log('Viewing item:', item);
    
  }

  updateItem(item: any): void {
    console.log('Updating item:', item);
    
  }

  deleteItem(id: number): void {
    this.adminService.deleteMenuItem(id).subscribe(() => {
      this.menuItems = this.menuItems.filter(m => m.foodItemID !== id);
    });
  }

  searchItems(query: string): void {
    if (query.trim()) {
      this.menuItems = this.allmenuItems.filter(item =>
        item.foodItemName.toLowerCase().includes(query.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(query.toLowerCase()) ||
        item.dietaryPreferenceName.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.menuItems = [...this.allmenuItems]; // reset when cleared
    }
  }
}


