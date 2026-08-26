import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";



@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  step = 1;
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  showNewPassword = false;
  showConfirmPassword = false;
  passwordMatch = false;

  constructor(private authService: AuthService, private router: Router) {}

  checkPasswords() {
    this.passwordMatch = this.newPassword === this.confirmPassword;
  }

  resetForm() {
    this.step = 1;
    this.email = '';
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.message = '';
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.passwordMatch = false;
  }

  sendOtp() {
    if (!this.email) {
      this.message = 'Please enter your email.';
      return;
    }
    this.authService.forgotPassword(this.email).subscribe({
      next: res => {
        this.message = res.message;
        this.step = 2;
      },
      error: err => this.message = err.error?.message || 'Failed to send OTP'
    });
  }

  verifyOtp() {
    if (!this.otp) {
      this.message = 'Please enter the OTP.';
      return;
    }
    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: res => {
        this.message = res.message;
        this.step = 3;
      },
      error: err => this.message = err.error?.message || 'Invalid or expired OTP'
    });
  }

  resetPassword() {
    if (!this.newPassword || this.newPassword.length < 8) {
      this.message = 'Password must be at least 8 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
    this.message = 'Passwords do not match.';
    return;
    }
    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: res => {
        this.message = res.message;
        this.resetForm();
        this.step = 1;
      },
      error: err => this.message = err.error?.message || 'Password reset failed'
    });
  }
   toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
