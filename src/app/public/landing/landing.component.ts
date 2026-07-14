import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';   
import {LoginComponent} from "../../auth/login/login.component";
import { SignupComponent } from '../../auth/signup/signup.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';


declare var bootstrap: any;

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginComponent, SignupComponent,HeaderComponent,FooterComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit{

  currentUser: any = null;

  private showingExpertise = false;
  name: string = '';
  email: string = '';
  password: string = '';

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
  }
   // 🔹 Swap About Us / Expertise cards when clicked
  swapCards(): void {
    const carouselElement = document.querySelector('#aboutExpertiseCarousel');
    if (carouselElement) {
      const carousel = new bootstrap.Carousel(carouselElement);
      if (this.showingExpertise) {
        carousel.prev(); // go back to About Us
      } else {
        carousel.next(); // go forward to Expertise
      }
      this.showingExpertise = !this.showingExpertise; 
    }
  }
  goToSignup(): void {
  this.router.navigate(['/signup']);
}

  // Signup handler (real API)
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
          // this.authService.setToken(res.token);
          // Save both token and user info
          const jwt = typeof res.token === 'string' ? res.token : res.token.token;
          const user = res.user ?? { email: res.token.email, isAdmin: res.token.isAdmin };

          this.authService.setSession(jwt, user);
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

  // Menu tab click
  goToMenu(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/menu']);
    } else {
      alert('Please login or signup to view the menu.');
    }
  }

logout(): void {
  // Clear session via AuthService
  this.authService.logout();

  // Reset currentUser so template switches back to Sign in button
  this.currentUser = null;

  // Optional: redirect to landing or login
  this.router.navigate(['/']);
}
}