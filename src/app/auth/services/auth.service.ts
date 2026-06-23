import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';

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

  // Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('/api/Auth/Login', credentials);
  }

  // Saving both token + user
    setSession(token: string, user: any): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));

    // Auto logout after 5 minutes
    this.logoutTimer?.unsubscribe();
    this.logoutTimer = timer(5 * 60 * 1000).subscribe(() => this.logout());
  }

  // Get JWT
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  getUserId(): number | null {
  const user = this.getUser();
  return user ? user.userId : null;
  }
  
  getUser(): any | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.logoutTimer?.unsubscribe();
    this.router.navigate(['/logout']);
  }

  // Check Login Status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.isAdmin === true;
  }
}



