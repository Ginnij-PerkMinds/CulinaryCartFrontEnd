import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';   // ✅ correct path
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ✅ Signup handler (real API)
  onSignup(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.signup({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.isLoading = false;

        // Save JWT if backend returns { token: "..." }
        if (res.token) {
          this.authService.setToken(res.token);
        }

        this.successMessage = res.message || 'Signup successful!';
        this.router.navigate(['/menu']);   // redirect to menu
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Signup failed. Please try again.';
      }
    });
  }

  // ✅ Menu tab click
  goToMenu(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/menu']);
    } else {
      alert('Please login or signup to view the menu.');
    }
  }
}
