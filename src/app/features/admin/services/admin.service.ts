import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuResponse } from '../model/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private menuUrl = 'http://localhost:5209/api/Menu';
  private categoryUrl = 'http://localhost:5209/api/Category/GetCategories';
  private dietUrl = 'http://localhost:5209/api/DietaryPreference/GetDietaryPreferences';

  constructor(private http: HttpClient) {}

  // Fetch categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categoryUrl);
  }

  // Fetch dietary preferences
  getDietaryPreferences(): Observable<any[]> {
    return this.http.get<any[]>(this.dietUrl);
  }

  // Fetch menu with filters
  getFilteredMenu(categoryName?: string, dietName?: string, pageNumber: number = 1, pageSize: number = 50): Observable<MenuResponse> {
    const params: any = { PageNumber: pageNumber, PageSize: pageSize };
    if (categoryName) params.CategoryName = categoryName;
    if (dietName) params.DietaryPreferenceName = dietName;

    return this.http.get<MenuResponse>(`${this.menuUrl}/ShowMenu`, { params });
  }
  
  
  toggleStock(id: number, inStock: boolean) {
  return this.http.put(`/api/Menu/ToggleStock/${id}`, inStock);
  }

  // Delete menu item
  deleteMenuItem(id: number): Observable<void> {
  return this.http.delete<void>(`${this.menuUrl}/DeleteMenu/${id}`);
  }
}



