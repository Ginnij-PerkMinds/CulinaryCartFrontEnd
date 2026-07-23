import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { CategoryUpdateRequest, CategoryResponse } from '../../model/category.dto';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  categories: CategoryResponse[] = [];
  newCategoryName = '';
  editingCategoryId: number | null = null;
  editingCategoryName = '';
  notification: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private normalizeMessage(res: any): string {
    // If backend returned a plain string
    if (typeof res === 'string') {
      return res;
    }
    // If backend returned an object with a message property
    if (res && typeof res.message === 'string') {
      return res.message;
    }
    // If backend error is wrapped
    if (res && typeof res.error === 'string') {
      return res.error;
    }
    // If Angular wrapped the string in an object
    if (res && typeof res === 'object') {
      return res.text || JSON.stringify(res);
    }
    return 'Unknown response from server';
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => this.showNotification(this.normalizeMessage(err.error))
    });
  }

  addCategory(): void {
    if (this.newCategoryName.trim()) {
      const request: CategoryUpdateRequest = { categoryName: this.newCategoryName };
      this.categoryService.addCategory(request).subscribe({
        next: (res) => {
          this.newCategoryName = '';
          this.loadCategories();
          this.showNotification(this.normalizeMessage(res));
        },
        error: (err) => this.showNotification(this.normalizeMessage(err.error))
      });
    }
  }

  startEdit(category: CategoryResponse): void {
    this.editingCategoryId = category.categoryId;
    this.editingCategoryName = category.categoryName;
  }

  saveEdit(): void {
    if (this.editingCategoryId && this.editingCategoryName.trim()) {
      const request: CategoryUpdateRequest = { categoryName: this.editingCategoryName };
      this.categoryService.updateCategory(this.editingCategoryId, request).subscribe({
        next: (res) => {
          this.editingCategoryId = null;
          this.editingCategoryName = '';
          this.loadCategories();
          this.showNotification(this.normalizeMessage(res));
        },
        error: (err) => this.showNotification(this.normalizeMessage(err.error))
      });
    }
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.editingCategoryName = '';
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (res) => {
        this.loadCategories();
        this.showNotification(this.normalizeMessage(res));
      },
      error: (err) => this.showNotification(this.normalizeMessage(err.error))
    });
  }

  showNotification(message: string): void {
    this.notification = message;
    setTimeout(() => this.notification = null, 3000);
  }
}
