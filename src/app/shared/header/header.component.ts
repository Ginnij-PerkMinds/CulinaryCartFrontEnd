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
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phoneNo: ['', Validators.required],
      address: [''],
      emailId: [''],
      houseNo: [''],
      locality: [''],
      landmark: [''],
      city: [''],
      district: [''],
      pincode: [''],
      state: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });

    if (this.authService.isLoggedIn()) {
      const storedUser = this.authService.getUser();
      if (storedUser) {
        this.currentUser = storedUser;
        this.profileForm.patchValue(storedUser);
      }
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

    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe(user => {
        this.currentUser = user;
        this.profileForm.patchValue(user);
        this.authService.setSession(this.authService.getToken()!, user); 
      });
    }
  }

  enableEdit() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.profileForm.patchValue(this.currentUser);
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  saveProfile() {
    const updated = this.profileForm.value;
    const formData = new FormData();

    formData.append('name', updated.name);
    formData.append('phoneNo', updated.phoneNo);
    formData.append('address', updated.address);
    formData.append('emailId', updated.emailId);
    if (updated.houseNo) formData.append('houseNo', updated.houseNo);
    if (updated.locality) formData.append('locality', updated.locality);
    if (updated.landmark) formData.append('landmark', updated.landmark);
    if (updated.city) formData.append('city', updated.city);
    if (updated.district) formData.append('district', updated.district);
    if (updated.pincode) formData.append('pincode', updated.pincode);
    if (updated.state) formData.append('state', updated.state);

    if (this.selectedFile) {
      formData.append('profilePic', this.selectedFile);
    }

    this.userService.updateProfile(this.currentUser.userId, formData)
      .subscribe(res => {
        alert(res.message);
        if (res.user) {
          this.currentUser = res.user;
          this.authService.setSession(this.authService.getToken()!, res.user);
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
        alert(res.message);
        if (res.message === 'Password updated successfully') {
          this.passwordForm.reset();
        }
      });
  }
}






