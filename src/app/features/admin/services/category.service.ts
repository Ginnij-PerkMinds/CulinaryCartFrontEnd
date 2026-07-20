import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = '/api/Category';   // adjust if your API base differs

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetCategories`);
  }

  getCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/GetCategory/${id}`);
  }

  addCategory(category: { name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddCategory`, category);
  }

  updateCategory(id: number, category: { name: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateCategory/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteCategory/${id}`);
  }
}
