import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
  @ViewChild('addMenuModal') modalElement!: ElementRef;

  addMenuForm: FormGroup;
  selectedFile: File | null = null;
  categories: any[] = [];
  dietaryPreferences: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.addMenuForm = this.fb.group({
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.addMenuForm.invalid) return;

    const formData = new FormData();

    // Append with exact casing expected by backend DTO
    formData.append('FoodItemName', this.addMenuForm.get('foodItemName')?.value);
    formData.append('Price', String(this.addMenuForm.get('price')?.value));
    formData.append('Offers', this.addMenuForm.get('offers')?.value);
    formData.append('CategoryName', this.addMenuForm.get('categoryName')?.value);
    formData.append('DietaryPreferenceName', this.addMenuForm.get('dietaryPreferenceName')?.value);

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.http.post('/api/Menu/AddMenu', formData).subscribe({
      next: () => {
        alert('Menu item added successfully!');
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        alert('Error adding item');
      }
    });
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






