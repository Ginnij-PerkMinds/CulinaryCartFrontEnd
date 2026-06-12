import { Component, viewChild, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {AuthService} from "../../auth/services/auth.service";
import { CartComponent } from '../../features/cart/cart/cart.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
constructor(public authService: AuthService) {}  

@ViewChild(CartComponent) cart!: CartComponent;

cartNotification: string | null = null;

showCartNotification(message: string) {
    this.cartNotification = message;
    setTimeout(() => {
      this.cartNotification = null;
    }, 3000); // auto-hide after 3s
  }
}
