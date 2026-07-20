import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DietaryPreferencesService {
  private baseUrl = '/api/DietaryPreference';   // adjust if your API base differs

  constructor(private http: HttpClient) {}

  getDietaryPreferences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetDietaryPreferences`);
  }

  getDietaryPreference(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/GetDietaryPreference/${id}`);
  }

  addDietaryPreference(diet: { name: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddDietaryPreference`, diet);
  }

  updateDietaryPreference(id: number, diet: { name: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateDietaryPreference/${id}`, diet);
  }

  deleteDietaryPreference(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteDietaryPreference/${id}`);
  }
}
