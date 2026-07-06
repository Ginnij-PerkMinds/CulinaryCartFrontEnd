import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { MenuModalComponent } from '../../menu-modal/menu-modal.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Fuse from 'fuse.js';

@Component({
  selector: 'app-admin-menu',
  standalone: true,   
  imports: [CommonModule, FormsModule, CurrencyPipe, MenuModalComponent], 
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
  @ViewChild(MenuModalComponent) menuModal!: MenuModalComponent;
  @ViewChild('deleteModal') deleteModal!: ElementRef;

  categories: any[] = [];
  dietaryPreferences: any[] = [];
  menuItems: any[] = [];
  allmenuItems: any[] = [];

  selectedCategory: string = '';
  selectedDiet: string = '';
  itemToDelete: any = null;

  notification: string | null = null;

  private fuse: Fuse<any> | null = null;

  constructor(private adminService: AdminService, private http: HttpClient) {}

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
         this.fuse = new Fuse(this.allmenuItems, {           // fusion search setup
          keys: ['foodItemName', 'categoryName', 'dietaryPreferenceName', 'offers'],
          threshold: 0.3, // lower = stricter, higher = fuzzier
        });
      },
      error: (err) => console.error('Menu grid pull error:', err)
    });
  }
  
  applyFilters(): void {
  this.menuItems = this.allmenuItems.filter(item => {
    const categoryMatch = !this.selectedCategory || item.categoryName === this.selectedCategory;
    const dietMatch = !this.selectedDiet || item.dietaryPreferenceName === this.selectedDiet;
    return categoryMatch && dietMatch; // intersection logic
  });
}

applyCategoryFilter(category: string): void {
  this.selectedCategory = category;
  this.applyFilters();
}

applyDietFilter(diet: string): void {
  this.selectedDiet = diet;
  this.applyFilters();
}

  updateItem(item: any): void {
    this.menuModal.openEditModal(item);
  }

  toggleStock(item: any): void {
  const newStatus = !item.inStock;

  this.http.put(`/api/Menu/ToggleStock/${item.foodItemID}`, newStatus).subscribe({
    next: () => {
      item.inStock = newStatus;
      if (!newStatus) {
        item.remainingQuantity = 0; //  manual toggle off sets quantity to 0
      }
      this.showNotification(`Item ${newStatus ? 'marked In Stock' : 'marked Out of Stock'}`);
    },
    error: (err) => {
      console.error(err);
      this.showNotification('Error updating stock status');
    }
  });
}
   // Redirect to delete modal
  deleteItem(item: any): void {
    this.itemToDelete = item;
    import('bootstrap').then(({ Modal }) => {
      let modal = Modal.getInstance(this.deleteModal.nativeElement);
      if (!modal) {
        modal = new Modal(this.deleteModal.nativeElement);
      }
      modal.show();
    });
  }

  // Delete the item in the modal
  confirmDelete(): void {
    if (!this.itemToDelete) return;
    this.adminService.deleteMenuItem(this.itemToDelete.foodItemID).subscribe({
      next: () => {
        this.menuItems = this.menuItems.filter(m => m.foodItemID !== this.itemToDelete.foodItemID);
        this.allmenuItems = this.allmenuItems.filter(m => m.foodItemID !== this.itemToDelete.foodItemID);
        this.itemToDelete = null;
        this.showNotification('Item deleted successfully!');
        import('bootstrap').then(({ Modal }) => {
          const modal = Modal.getInstance(this.deleteModal.nativeElement);
          modal?.hide();
        });
      },
      error: (err) => {
        console.error('Failed to purge product record:', err);
        this.showNotification('Error deleting item');
      }
    });
  }

   searchItems(query: string): void {
    const searchString = query ? query.trim() : '';
    if (searchString && this.fuse) {
      this.menuItems = this.fuse.search(searchString).map(result => result.item);
    } else {
      this.menuItems = [...this.allmenuItems];
    }
  }

    showNotification(message: string): void {
    this.notification = message;
    setTimeout(() => {
      this.notification = null;
    }, 3000); 
  } 
}