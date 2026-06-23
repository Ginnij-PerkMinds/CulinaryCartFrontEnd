import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5209/api/User';  

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/GetAllUsers`);  
  }
  
  // Get user by ID (using saved userId after login)
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/GetUser/${id}`);
  }

  // Update flags (isActive, isAdmin) → backend route is UpdateFlags/{id}
  updateFlags(id: number, isActive: boolean, isAdmin: boolean): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/UpdateFlags/${id}`,
      { isActive, isAdmin }
    );
  }

  // Update profile → backend route is UpdateUserForm/{id}, expects FormData
  updateProfile(id: number, updated: Partial<User>): Observable<{ message: string }> {
    const formData = new FormData();
    if (updated.name) formData.append('name', updated.name);
    if (updated.phoneNo) formData.append('phoneNo', updated.phoneNo);
    if (updated.address) formData.append('address', updated.address);

    return this.http.put<{ message: string }>(
      `${this.apiUrl}/UpdateUserForm/${id}`,
      formData
    );
  }

  // Change password → backend route is ChangePassword/{id}, expects JSON
  changePassword(id: number, oldPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/ChangePassword/${id}`,
      { oldPassword, newPassword }
    );
  }

  // Delete user (optional)
  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/DeleteUser/${id}`);
  }
}



