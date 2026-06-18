import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword: boolean = false;

  togglePassword() {             
    this.showPassword = !this.showPassword;
  }

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        // // Save JWT if backend returns { token: "..." }
        // if (res.token && res.user) {
        //   this.authService.setSession(res.token, res.user);
        // }
        // ✅ Always call setSession, not setToken
          if (res.token) {
          const jwt = typeof res.token === 'string' ? res.token : res.token.token;
          const user = res.user ?? { email: res.token.email, isAdmin: res.token.isAdmin };

          this.authService.setSession(jwt, user);
          }
        this.successMessage = res.message || 'Login successful!';

         // 🔍 Debug logs to inspect response
          console.log('Login response:', res);
          console.log('isAdmin flag:', res.user?.isAdmin);
          console.log('token object:', res.token);

        // --- Admin redirect logic (commented) ---
        
        if (res.token && res.token.isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/menu']);
        }

        // setTimeout(() => this.router.navigate(['/menu']), 2000); // redirect after 2s
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = err.error.message || 'Invalid email or password.';
        } else {
          this.errorMessage = 'Login failed. Please try again later.';
        }
      }
    });
  }
}


