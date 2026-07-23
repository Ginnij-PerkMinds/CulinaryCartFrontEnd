// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { DietUpdateRequest } from '../model/diet.dto';

// @Injectable({
//   providedIn: 'root'
// })
// export class DietaryPreferencesService {
//   private baseUrl = '/api/DietaryPreference';

//   constructor(private http: HttpClient) {}

//   getDietaryPreferences(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/GetDietaryPreferences`);
//   }

//   getDietaryPreference(id: number): Observable<any> {
//     return this.http.get<any>(`${this.baseUrl}/GetDietaryPreference/${id}`);
//   }

//   addDietaryPreference(request: DietUpdateRequest): Observable<any> {
//     return this.http.post(`${this.baseUrl}/AddDietaryPreference`, request);
//   }

//   updateDietaryPreference(id: number, request: DietUpdateRequest): Observable<any> {
//     return this.http.put(`${this.baseUrl}/UpdateDietaryPreference/${id}`, request);
//   }

//   deleteDietaryPreference(id: number): Observable<any> {
//     return this.http.delete(`${this.baseUrl}/DeleteDietaryPreference/${id}`);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DietUpdateRequest } from '../model/diet.dto';

@Injectable({
  providedIn: 'root'
})
export class DietaryPreferencesService {
  private baseUrl = 'http://localhost:5209/api/DietaryPreference';

  constructor(private http: HttpClient) {}

  // GET all dietary preferences
  getDietaryPreferences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetDietaryPreferences`);
  }

  // POST new dietary preference
  addDietaryPreference(request: DietUpdateRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddDietaryPreference`, request);
  }

  // PUT update dietary preference
  updateDietaryPreference(dietId: number, request: DietUpdateRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateDietaryPreference/${dietId}`, request);
  }

  // DELETE dietary preference
  deleteDietaryPreference(dietId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteDietaryPreference/${dietId}`);
  }
}
