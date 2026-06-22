// import { Component, viewChild, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import {AuthService} from "../../auth/services/auth.service";
// import { CartComponent } from '../../features/cart/cart/cart.component';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [CommonModule, RouterModule, CartComponent],
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.scss']
// })

// export class HeaderComponent {
// constructor(public authService: AuthService) {}  

// @ViewChild(CartComponent) cart!: CartComponent;

// cartNotification: string | null = null;

// showCartNotification(message: string) {
//     this.cartNotification = message;
//     setTimeout(() => {
//       this.cartNotification = null;
//     }, 3000); // auto-hide after 3s
//   }
// }

import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../auth/services/auth.service";
import { CartComponent } from '../../features/cart/cart/cart.component';
import { UserService } from '../../features/admin/services/user.service';
import { User } from '../../features/admin/model/user.model';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  @ViewChild(CartComponent) cart!: CartComponent;

  cartNotification: string | null = null;
  currentUser!: User;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  editMode = false;

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phoneNo: ['', Validators.required],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });

    if (this.authService.isLoggedIn()) {
      this.userService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
        this.profileForm.patchValue(user);
      });
    }
  }

  showCartNotification(message: string) {
    this.cartNotification = message;
    setTimeout(() => {
      this.cartNotification = null;
    }, 3000);
  }

  // Profile modal
  openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) new bootstrap.Modal(modal).show();
  }

  enableEdit() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.profileForm.patchValue(this.currentUser);
  }

  saveProfile() {
    const updated = this.profileForm.value;
    this.userService.updateProfile(this.currentUser.userId, updated)
      .subscribe(res => {
        if (res.includes('exists')) {
          alert(res);
        } else {
          alert('Profile updated successfully');
          this.currentUser = { ...this.currentUser, ...updated };
          this.editMode = false;
        }
      });
  }

  // Password modal
  openChangePasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) new bootstrap.Modal(modal).show();
  }

  changePassword() {
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    this.userService.changePassword(this.currentUser.userId, oldPassword, newPassword)
      .subscribe(res => {
        alert(res);
        if (res === 'Password updated successfully') {
          this.passwordForm.reset();
        }
      });
  }
}


