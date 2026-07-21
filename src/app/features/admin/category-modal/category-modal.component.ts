import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent implements OnInit {
  @ViewChild('categoryModal') modalElement!: ElementRef;
  @Output() categoriesChanged = new EventEmitter<void>();

  categories: any[] = [];
  newCategoryName = '';
  editingCategoryId: number | null = null;
  editingCategoryName = '';
  notification: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  showModal(): void {
    if (this.modalElement) {
      import('bootstrap').then(({ Modal }) => {
        let modal = Modal.getInstance(this.modalElement.nativeElement);
        if (!modal) {
          modal = new Modal(this.modalElement.nativeElement);
        }
        modal.show();
      });
    }
  }

  closeModal(): void {
    import('bootstrap').then(({ Modal }) => {
      const modal = Modal.getInstance(this.modalElement.nativeElement);
      modal?.hide();
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error loading categories', err)
    });
  }

  addCategory(): void {
    if (this.newCategoryName.trim()) {
      this.categoryService.addCategory({ name: this.newCategoryName }).subscribe({
        next: () => {
          this.newCategoryName = '';
          this.loadCategories();
          this.categoriesChanged.emit();
          this.showNotification('Category added successfully!');
        },
        error: () => this.showNotification('Error adding category')
      });
    }
  }

  startEdit(cat: any): void {
    this.editingCategoryId = cat.id;
    this.editingCategoryName = cat.name;
  }

  saveEdit(): void {
    if (this.editingCategoryId && this.editingCategoryName.trim()) {
      this.categoryService.updateCategory(this.editingCategoryId, { name: this.editingCategoryName }).subscribe({
        next: () => {
          this.editingCategoryId = null;
          this.editingCategoryName = '';
          this.loadCategories();
          this.categoriesChanged.emit();
          this.showNotification('Category updated successfully!');
        },
        error: () => this.showNotification('Error updating category')
      });
    }
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.editingCategoryName = '';
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.categoriesChanged.emit();
        this.showNotification('Category deleted successfully!');
      },
      error: () => this.showNotification('Error deleting category')
    });
  }

  showNotification(message: string): void {
    this.notification = message;
    setTimeout(() => this.notification = null, 3000);
  }
}
