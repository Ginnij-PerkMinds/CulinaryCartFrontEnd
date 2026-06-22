import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5209/api/User';  

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/GetAllUsers`);  
  }

  // updateUser(id: number, user: User): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/UpdateUser/${id}`, user);
  // }
  //  // Admin toggles
  // updateFlags(id: number, isActive: boolean, isAdmin: boolean): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/UpdateFlags/${id}`, { isActive, isAdmin });
  // }
  updateFlags(id: number, isActive: boolean, isAdmin: boolean): Observable<any> {
  return this.http.put(`${this.apiUrl}/UpdateUser/${id}`, {
    IsActive: isActive,
    IsAdmin: isAdmin
  });
}

updateProfile(id: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/UpdateUser/${id}`, formData);
}

}


