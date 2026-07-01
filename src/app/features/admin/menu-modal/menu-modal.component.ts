import { Component, ViewChild, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-menu-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss']
})
export class MenuModalComponent implements OnInit {
  @ViewChild('menuModal') modalElement!: ElementRef;

  @Input() categories: any[] = [];
  @Input() dietaryPreferences: any[] = [];
  @Output() itemSaved = new EventEmitter<void>();

  menuForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isEditMode = false;
  selectedItem: any;

  // ✅ Toast notification state
  notification: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.menuForm = this.fb.group({
      foodItemName: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      offers: [''],
      categoryName: ['', Validators.required],
      dietaryPreferenceName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Fetch categories
    this.http.get<any[]>('/api/Category/GetCategories')
      .subscribe(res => this.categories = res);

    // Fetch dietary preferences
    this.http.get<any[]>('/api/DietaryPreference/GetDietaryPreferences')
      .subscribe(res => this.dietaryPreferences = res);
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedItem = null;
    this.menuForm.reset();
    this.previewUrl = null;
    this.showModal();
  }

  openEditModal(item: any): void {
    this.isEditMode = true;
    this.selectedItem = item;
    this.menuForm.patchValue({
      foodItemName: item.foodItemName,
      description: item.description,
      price: item.price,
      offers: item.offers,
      categoryName: item.categoryName,
      dietaryPreferenceName: item.dietaryPreferenceName
    });
    this.previewUrl = item.imageUrl ? 'http://localhost:5209' + item.imageUrl : null;
    this.showModal();
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
   if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;   // ✅ Update preview
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // ✅ Toast helper
  showNotification(message: string): void {
    this.notification = message;
    setTimeout(() => {
      this.notification = null;
    }, 3000); // auto-hide after 3 seconds
  }

  onSubmit(): void {
    if (this.menuForm.invalid) return;

    const formData = new FormData();
    formData.append('FoodItemName', this.menuForm.get('foodItemName')?.value);
    formData.append('Description', this.menuForm.get('description')?.value || '');
    formData.append('Price', String(this.menuForm.get('price')?.value));
    formData.append('Offers', this.menuForm.get('offers')?.value || '');
    formData.append('CategoryName', this.menuForm.get('categoryName')?.value);
    formData.append('DietaryPreferenceName', this.menuForm.get('dietaryPreferenceName')?.value);

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    if (this.isEditMode && this.selectedItem) {
      // Update existing item
      this.http.put(`/api/Menu/UpdateMenu/${this.selectedItem.foodItemID}`, formData).subscribe({
        next: () => {
          this.itemSaved.emit();
          this.showNotification('Menu item updated successfully!');
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.showNotification('Error updating item');
        }
      });
    } else {
      // Add new item
      this.http.post('/api/Menu/AddMenu', formData).subscribe({
        next: () => {
          this.itemSaved.emit();
          this.showNotification('Menu item added successfully!');
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.showNotification('Error adding item');
        }
      });
    }
  }

  closeModal(): void {
    if (typeof window !== 'undefined') {
      import('bootstrap').then(({ Modal }) => {
        const modal = Modal.getInstance(this.modalElement.nativeElement);
        modal?.hide();
      });
    }
  }
}







