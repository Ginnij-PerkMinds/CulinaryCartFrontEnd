import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DietaryPreferencesService } from '../../services/dietarypreferences.service';
import { DietUpdateRequest, DietResponse } from '../../model/diet.dto';

@Component({
  selector: 'app-admin-dietarypreference',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dietarypreference.component.html',
  styleUrls: ['./admin-dietarypreference.component.scss']
})
export class AdminDietaryPreferenceComponent implements OnInit {
  dietaryPreferences: DietResponse[] = [];
  newDietName = '';
  editingPrefId: number | null = null;
  editingPrefName = '';
  notification: string | null = null;

  constructor(private dietaryService: DietaryPreferencesService) {}

  ngOnInit(): void {
    this.loadDietaryPreferences();
  }

  private normalizeMessage(res: any): string {
  if (typeof res === 'string') {                     // If backend returned a plain string
    return res;
  }
  if (res && typeof res.message === 'string') {      // If backend returned an object with a message property
    return res.message;
  }
  if (res && typeof res.error === 'string') {         // If backend error is wrapped
    return res.error;
  }
  if (res && typeof res === 'object') {
    return JSON.stringify(res);                      // or res.text if available
  }
  return 'Unknown response from server';
}

  loadDietaryPreferences(): void {
    this.dietaryService.getDietaryPreferences().subscribe({
      next: (data) => this.dietaryPreferences = data,
      error: (err) => this.showNotification(this.normalizeMessage(err.error))
    });
  }

  addDietaryPreference(): void {
    if (this.newDietName.trim()) {
      const request: DietUpdateRequest = { diet: this.newDietName };
      this.dietaryService.addDietaryPreference(request).subscribe({
        next: (res) => {
          this.newDietName = '';
          this.loadDietaryPreferences();
          this.showNotification(this.normalizeMessage(res));
        },
        error: (err) => this.showNotification(this.normalizeMessage(err.error))
      });
    }
  }

  startEdit(pref: DietResponse): void {
    this.editingPrefId = pref.dietId;
    this.editingPrefName = pref.diet;
  }

  saveEdit(): void {
    if (this.editingPrefId && this.editingPrefName.trim()) {
      const request: DietUpdateRequest = { diet: this.editingPrefName };
      this.dietaryService.updateDietaryPreference(this.editingPrefId, request).subscribe({
        next: (res) => {
          this.editingPrefId = null;
          this.editingPrefName = '';
          this.loadDietaryPreferences();
          this.showNotification(this.normalizeMessage(res));
        },
        error: (err) => this.showNotification(this.normalizeMessage(err.error))
      });
    }
  }

  cancelEdit(): void {
    this.editingPrefId = null;
    this.editingPrefName = '';
  }

  deleteDietaryPreference(dietId: number): void {
    this.dietaryService.deleteDietaryPreference(dietId).subscribe({
      next: (res) => {
        this.loadDietaryPreferences();
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