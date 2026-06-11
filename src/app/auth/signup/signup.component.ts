import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {HeaderComponent} from "../../shared/header/header.component";
import {FooterComponent} from "../../shared/footer/footer.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  name = '';
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

  onSignup(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Signup successful! Please login.';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = err.error.message || 'User already exists. Please try logging in.';
        } else if (err.status === 400) {
          this.errorMessage = err.error.message || 'Password does not meet requirements.';
        } else {
          this.errorMessage = 'Signup failed. Please try again later.';
        }
      }
    });
  }
}

