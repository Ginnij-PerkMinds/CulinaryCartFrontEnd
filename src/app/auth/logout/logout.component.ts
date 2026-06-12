import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: `<p>You have been logged out.</p>`
})
export class LogoutComponent {
  constructor(private authService: AuthService, private router: Router) {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}

