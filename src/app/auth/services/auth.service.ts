import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription, timer, tap } from 'rxjs';
import { User } from '../../features/admin/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'authUser';
  private logoutTimer?: Subscription;

  constructor(private http: HttpClient, private router: Router) {}

  // Signup
  signup(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post('/api/Auth/Signup', user);
  }

  // Login now expects token + user object from backend
  login(credentials: { email: string; password: string }): Observable<{ token: string; message: string; user: User }> {
    return this.http.post<{ token: string; message: string; user: User }>('/api/Auth/Login', credentials)
      .pipe(
        tap(res => {
          this.setSession(res.token, res.user);
        })
      );
  }

  // Save both token + user object in localStorage
  setSession(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));

    // Auto logout after 5 minutes
    this.logoutTimer?.unsubscribe();
    this.logoutTimer = timer(5 * 60 * 1000).subscribe(() => this.logout());
  }

  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Get logged-in userId directly from stored user object
  getUserId(): number | null {
    const user = this.getUser();
    return user ? user.userId : null;
  }

  // Get full user object
  getUser(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Logout clears both token + user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.logoutTimer?.unsubscribe();
    this.router.navigate(['/logout']);
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Check admin role
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.isAdmin === true;
  }
}




