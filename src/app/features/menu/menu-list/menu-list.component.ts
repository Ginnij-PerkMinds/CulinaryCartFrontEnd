import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { MenuItem } from '../model/menu-item.model'; 
import { CurrencyPipe, CommonModule} from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],  
  standalone: true,      
  imports: [CurrencyPipe, CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class MenuListComponent implements OnInit {
  menuItems: MenuItem[] = [];

  //Sidebar filter options
  categories: any[] = [];
  dietaryPreferences: any[] = [];

  selectedCategories: string[] = [];
  selectedDiets: string[] = [];

  quantities: number[] = Array.from({length: 50}, (_, i) => i + 1);

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    //load categories and diets from DB
    this.menuService.getCategories().subscribe(data => this.categories = data);           // <-- added
    this.menuService.getDietaryPreferences().subscribe(data => this.dietaryPreferences = data); // <-- added

    this.applyFilters(); // load menu items
  }

  //Checkbox handlers
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

  //Apply filters via service
  applyFilters() {
    this.menuService.getFilteredMenu(this.selectedCategories, this.selectedDiets)
      .subscribe({
        next: (response) => {
          this.menuItems = response.data.map(item => ({ ...item, selectedQty: 1 }));
          console.log('Filtered API response:', response);
          this.menuItems = response.data;
        },
        error: (err) => console.error('Error loading menu', err)
      });
    }
      addToCart(item: any) { 
    console.log(`Adding ${item.selectedQty} x ${item.foodItemName} to cart`);
  }
  }





