import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private logoutTimer?: Subscription;

  constructor(private http: HttpClient, private router: Router) {}

  // Signup
  signup(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post('/api/Auth/Signup', user);
  }

  // Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('/api/Auth/Login', credentials);
  }

  // Saving JWT 
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);

    // Auto logout after 5 minutes
    this.logoutTimer?.unsubscribe();
    this.logoutTimer = timer(5 * 60 * 1000).subscribe(() => this.logout());
  }

  // Get JWT
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.logoutTimer?.unsubscribe();
    this.router.navigate(['/logout']);
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }  
}


