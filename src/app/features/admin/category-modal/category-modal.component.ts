import { Component, OnInit, Output, EventEmitter} from '@angular/core';
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
  @Output() categoriesChanged = new EventEmitter<void>();
  
  categories: any[] = [];
  newCategoryName = '';
  editingCategoryId: number | null = null;
  editingCategoryName = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error loading categories', err)
    });
  }

  addCategory() {
    if (this.newCategoryName.trim()) {
      this.categoryService.addCategory({ name: this.newCategoryName }).subscribe({
        next: () => {
          this.newCategoryName = '';
          this.loadCategories();
          this.categoriesChanged.emit(); // 🔔 notify parent
        },
        error: (err) => console.error('Error adding category', err)
      });
    }
  }

  startEdit(cat: any) {
    this.editingCategoryId = cat.id;
    this.editingCategoryName = cat.name;
  }

  saveEdit() {
    if (this.editingCategoryId && this.editingCategoryName.trim()) {
      this.categoryService.updateCategory(this.editingCategoryId, { name: this.editingCategoryName }).subscribe({
        next: () => {
          this.editingCategoryId = null;
          this.editingCategoryName = '';
          this.loadCategories();
          this.categoriesChanged.emit();
        },
        error: (err) => console.error('Error updating category', err)
      });
    }
  }

  cancelEdit() {
    this.editingCategoryId = null;
    this.editingCategoryName = '';
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.categoriesChanged.emit();
      },
      error: (err) => console.error('Error deleting category', err)
    });
  }
}
