// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { UserService } from '../../services/user.service';
// import { User } from '../../model/user.model';
// import { DatePipe } from '@angular/common';

// @Component({
//   selector: 'app-admin-users',
//   standalone: true,
//   imports: [CommonModule],
//   providers: [DatePipe],
//   templateUrl: './admin-users.component.html',
//   styleUrls: ['./admin-users.component.scss']
// })
// export class AdminUsersComponent implements OnInit {
//   users: User[] = [];

//   constructor(private userService: UserService,
//               private datePipe: DatePipe) {}

//   ngOnInit(): void {
//     this.loadUsers();
//   }

//   loadUsers(): void {
//     this.userService.getAllUsers().subscribe(data => {
//       console.log("API Response:", data);
//       this.users = data.map(user => ({
//         ...user,
//         createdAtFormatted: this.datePipe.transform(user.createdAt, 'dd/MM/yyyy, hh:mm a') || '',
//         updatedAtFormatted: this.datePipe.transform(user.updatedAt, 'dd/MM/yyyy, hh:mm a') || '',
//         fullAddress: [
//           user.houseNo,
//           user.locality,
//           user.landmark,
//           user.city,
//           user.district,
//           user.pincode,
//           user.state
//         ].filter(Boolean).join(', ')
//       }));
//     });
//   }

//   toggleActive(user: User): void {
//     user.isActive = !user.isActive;
//     this.userService.updateUser(user.userId, user).subscribe(() => {
//       console.log("IsActive updated");
//     });
//   }

//   toggleAdmin(user: User): void {
//     user.isAdmin = !user.isAdmin;
//     this.userService.updateUser(user.userId, user).subscribe(() => {
//       console.log("IsAdmin updated");
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // ✅ Load all users
  loadUsers(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data.map(user => ({
        ...user,
        createdAtFormatted: this.datePipe.transform(user.createdAt, 'dd/MM/yyyy, hh:mm a') || '',
        updatedAtFormatted: this.datePipe.transform(user.updatedAt, 'dd/MM/yyyy, hh:mm a') || ''
      }));
    });
  }

  // ✅ Toggle Active flag
  toggleActive(user: User): void {
    user.isActive = !user.isActive;
    this.userService.updateFlags(user.userId, user.isActive, user.isAdmin)
      .subscribe({
        next: () => console.log("IsActive updated"),
        error: err => console.error("Error updating IsActive", err)
      });
  }

  // ✅ Toggle Admin flag
  toggleAdmin(user: User): void {
    user.isAdmin = !user.isAdmin;
    this.userService.updateFlags(user.userId, user.isActive, user.isAdmin)
      .subscribe({
        next: () => console.log("IsAdmin updated"),
        error: err => console.error("Error updating IsAdmin", err)
      });
  }

  // // ✅ Update profile (FormData for file upload)
  // updateProfile(user: User, profilePicFile?: File): void {
  //   const formData = new FormData();
  //   formData.append('Name', user.name);
  //   formData.append('EmailId', user.emailId);
  //   formData.append('PhoneNo', user.phoneNo);
  //   if (user.password) formData.append('Password', user.password);
  //   if (profilePicFile) formData.append('ProfilePic', profilePicFile);

  //   formData.append('HouseNo', user.houseNo || '');
  //   formData.append('Locality', user.locality || '');
  //   formData.append('City', user.city || '');
  //   formData.append('Pincode', user.pincode || '');

  //   this.userService.updateProfile(user.userId, formData)
  //     .subscribe({
  //       next: () => console.log("Profile updated"),
  //       error: err => console.error("Error updating profile", err)
  //     });
  }





