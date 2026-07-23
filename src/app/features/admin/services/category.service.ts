// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { CategoryUpdateRequest } from '../model/category.dto';

// @Injectable({
//   providedIn: 'root'
// })
// export class CategoryService {
//   private baseUrl = '/api/Category';

//   constructor(private http: HttpClient) {}

//   getCategories(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/GetCategories`);
//   }

//   getCategory(id: number): Observable<any> {
//     return this.http.get<any>(`${this.baseUrl}/GetCategory/${id}`);
//   }

//   addCategory(request: CategoryUpdateRequest): Observable<any> {
//     return this.http.post(`${this.baseUrl}/AddCategory`, request);
//   }

//   updateCategory(id: number, request: CategoryUpdateRequest): Observable<any> {
//     return this.http.put(`${this.baseUrl}/UpdateCategory/${id}`, request);
//   }

//   deleteCategory(id: number): Observable<any> {
//     return this.http.delete(`${this.baseUrl}/DeleteCategory/${id}`);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryUpdateRequest } from '../model/category.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:5209/api/Category';

  constructor(private http: HttpClient) {}

  // GET all categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetCategories`);
  }

  // POST new category
  addCategory(request: CategoryUpdateRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddCategory`, request);
  }

  // PUT update category
  updateCategory(categoryId: number, request: CategoryUpdateRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateCategory/${categoryId}`, request);
  }

  // DELETE category
  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteCategory/${categoryId}`);
  }
}

