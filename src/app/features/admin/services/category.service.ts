import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryDto {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:5209/api/category'; 

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetCategories`);
  }

  getCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetCategory/${id}`);
  }

  addCategory(category: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddCategory`, category);
  }

  updateCategory(id: number, category: { name: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateCategory/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteCategory/${id}`);
  }
}
