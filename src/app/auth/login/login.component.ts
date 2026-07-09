import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// import {SignupComponent} from '../signup/signup.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword: boolean = false;

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;

        // Always call setSession with token + user
        if (res.token && res.user) {
          this.authService.setSession(res.token, res.user);
        }

        this.successMessage = res.message || 'Login successful!';

        // 🔍 Debug logs
        console.log('Login response:', res);
        console.log('User object:', res.user);
        console.log('Token:', res.token);

        // Role-based redirect
        if (res.user?.isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/menu']);
        }
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

// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
//   email = '';
//   password = '';
//   showPassword: boolean = false;

//   errorMessage = '';
//   successMessage = '';
//   isLoading = false;

//   constructor(private authService: AuthService, private router: Router) {}

//   togglePassword(): void {
//     this.showPassword = !this.showPassword;
//   }

//   onLogin(): void {
//     this.errorMessage = '';
//     this.successMessage = '';
//     this.isLoading = true;

//     this.authService.login({ email: this.email, password: this.password }).subscribe({
//       next: (res) => {
//         this.isLoading = false;

//         // Always set session with token + user
//         if (res.token && res.user) {
//           this.authService.setSession(res.token, res.user);
//         }

//         this.successMessage = res.message || 'Login successful!';

//         // Debug logs (optional)
//         console.log('Login response:', res);
//         console.log('User object:', res.user);
//         console.log('Token:', res.token);

//         // Role-based redirect
//         if (res.user?.isAdmin) {
//           this.router.navigate(['/admin']);
//         } else {
//           this.router.navigate(['/menu']);
//         }
//       },
//       error: (err) => {
//         this.isLoading = false;
//         if (err.status === 401) {
//           this.errorMessage = err.error.message || 'Invalid email or password.';
//         } else {
//           this.errorMessage = 'Login failed. Please try again later.';
//         }
//       }
//     });
//   }
// }



