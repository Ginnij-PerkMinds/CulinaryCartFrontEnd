import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DietaryPreferencesService } from '../services/dietarypreferences.service';

@Component({
  selector: 'app-dietary-preferences-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dietary-preferences-modal.component.html',
  styleUrls: ['./dietary-preferences-modal.component.scss']
})
export class DietaryPreferencesModalComponent implements OnInit {
  dietaryPreferences: any[] = [];
  newDietName: string = '';
  editingDietId: number | null = null;
  editingDietName: string = '';

  constructor(private dietService: DietaryPreferencesService) {}

  ngOnInit() {
    this.loadDietaryPreferences();
  }

  loadDietaryPreferences() {
    this.dietService.getDietaryPreferences().subscribe({
      next: (data) => this.dietaryPreferences = data,
      error: (err) => console.error('Error loading dietary preferences', err)
    });
  }

  addDiet() {
    if (this.newDietName.trim()) {
      this.dietService.addDietaryPreference({ name: this.newDietName }).subscribe({
        next: () => {
          this.newDietName = '';
          this.loadDietaryPreferences();
        },
        error: (err) => console.error('Error adding dietary preference', err)
      });
    }
  }

  startEdit(diet: any) {
    this.editingDietId = diet.id;
    this.editingDietName = diet.name;
  }

  saveEdit() {
    if (this.editingDietId && this.editingDietName.trim()) {
      this.dietService.updateDietaryPreference(this.editingDietId, { name: this.editingDietName }).subscribe({
        next: () => {
          this.editingDietId = null;
          this.editingDietName = '';
          this.loadDietaryPreferences();
        },
        error: (err) => console.error('Error updating dietary preference', err)
      });
    }
  }

  cancelEdit() {
    this.editingDietId = null;
    this.editingDietName = '';
  }

  deleteDiet(id: number) {
    this.dietService.deleteDietaryPreference(id).subscribe({
      next: () => this.loadDietaryPreferences(),
      error: (err) => console.error('Error deleting dietary preference', err)
    });
  }
}


