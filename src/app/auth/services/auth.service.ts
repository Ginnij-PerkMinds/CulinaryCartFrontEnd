import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../features/admin/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'authUser';
  private logoutTimer?: Subscription;
  
  //modern injection pattern to check execution platform
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient, private router: Router) {}

  signup(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post('/api/Auth/Signup', user);
  }

  login(credentials: { email: string; password: string }): Observable<{ token: string; message: string; user: User }> {
    return this.http.post<{ token: string; message: string; user: User }>('/api/Auth/Login', credentials)
      .pipe(
        tap(res => {
          this.setSession(res.token, res.user);
        })
      );
  }

  // Safe wrapper for setting dynamic browser values
  setSession(token: string, user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    this.logoutTimer?.unsubscribe();
    this.logoutTimer = timer(5 * 60 * 1000).subscribe(() => this.logout());
  }

  // Safe wrapper for reading browser token
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user ? user.userId : null;
  }

  // Safe wrapper for reading full user configuration model
  getUser(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.userKey);
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.logoutTimer?.unsubscribe();
    this.router.navigate(['/logout']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.isAdmin === true;
  }
}