import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { MenuModalComponent } from '../../menu-modal/menu-modal.component';

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

  updateItem(item: any): void {
    this.menuModal.openEditModal(item);
  }

   // trigger modal instead of confirm()
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

  // call when user choose to delete the item in the modal
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
    showNotification(message: string): void {
    this.notification = message;
    setTimeout(() => {
      this.notification = null;
    }, 3000); 
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
      this.menuItems = [...this.allmenuItems]; 
    }
  }
}