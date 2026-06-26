import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuResponse } from '../model/menu-item.model';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = '/api/Menu/ShowMenu';
  private categoryUrl = '/api/Category/GetCategories';  
  private dietUrl = '/api/DietaryPreference/GetDietaryPreferences';

  constructor(private http: HttpClient) {}

  // Support multi-select filters
  getFilteredMenu(categories: string[], diets: string[], pageNumber: number=1, pageSize: number=50): Observable<MenuResponse> {
    const params: any = { PageNumber: pageNumber, PageSize: pageSize };
    if (categories.length) params.CategoryNames = categories.join(',');
    if (diets.length) params.DietaryPreferenceNames = diets.join(',');

    return this.http.get<MenuResponse>(this.apiUrl, { params });
  }
  // fetch categories from DB
  getCategories(): Observable<any[]> {                 
        return this.http.get<any[]>(this.categoryUrl);     
  }

  // fetch dietary preferences from DB
  getDietaryPreferences(): Observable<any[]> {         
    return this.http.get<any[]>(this.dietUrl);         
  }

 deleteMenuItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteMenu/${id}`);
  }

  updateMenuItem(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateMenu/${id}`, formData);
  }

  addMenuItem(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddMenu`, formData);
  }
}



