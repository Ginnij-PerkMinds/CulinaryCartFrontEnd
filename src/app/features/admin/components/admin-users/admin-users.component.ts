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
//               private datePipe:DatePipe
//   ) {}

//   ngOnInit(): void {
//     this.loadUsers();
//   }

//   loadUsers(): void {
//     this.userService.getAllUsers().subscribe(data => {
//       // this.users = data;
//       this.users = data.map(user => ({
//         ...user,
//         createdAtFormatted: this.datePipe.transform(user.createdAt, 'dd/MM/yyyy, hh:mm a'),
//         updatedAtFormatted: this.datePipe.transform(user.updatedAt, 'dd/MM/yyyy, hh:mm a')
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

  constructor(private userService: UserService,
              private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(data => {
      console.log("API Response:", data);
      this.users = data.map(user => ({
        ...user,
        createdAtFormatted: this.datePipe.transform(user.createdAt, 'dd/MM/yyyy, hh:mm a') || '',
        updatedAtFormatted: this.datePipe.transform(user.updatedAt, 'dd/MM/yyyy, hh:mm a') || '',
        fullAddress: [
          user.houseNo,
          user.locality,
          user.landmark,
          user.city,
          user.district,
          user.pincode,
          user.state
        ].filter(Boolean).join(', ')
      }));
    });
  }

  toggleActive(user: User): void {
    user.isActive = !user.isActive;
    this.userService.updateUser(user.userId, user).subscribe(() => {
      console.log("IsActive updated");
    });
  }

  toggleAdmin(user: User): void {
    user.isAdmin = !user.isAdmin;
    this.userService.updateUser(user.userId, user).subscribe(() => {
      console.log("IsAdmin updated");
    });
  }
}


