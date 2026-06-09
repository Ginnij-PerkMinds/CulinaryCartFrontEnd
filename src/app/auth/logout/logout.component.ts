//import { Component } from '@angular/core';
//import { RouterModule, Router } from '@angular/router';

//@Component({
  //selector: 'app-logout',
  //standalone: true,
  //imports: [RouterModule],
  //templateUrl: './logout.component.html',
  //styleUrls: ['./logout.component.scss']
//})
//export class LogoutComponent {
  //constructor(private router: Router) {}

  //ngOnInit(): void {
    //localStorage.removeItem('authToken');
   // sessionStorage.clear();
    //setTimeout(() => this.router.navigate(['/login']), 2000);
  //}
//}

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
    this.router.navigate(['/login']);
  }
}

