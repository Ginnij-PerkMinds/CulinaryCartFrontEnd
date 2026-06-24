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

  // Load all users
  loadUsers(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data.map(user => ({
        ...user,
        createdAtFormatted: this.datePipe.transform(user.createdAt, 'dd/MM/yyyy, hh:mm a') || '',
        updatedAtFormatted: this.datePipe.transform(user.updatedAt, 'dd/MM/yyyy, hh:mm a') || ''
      }));
    });
  }

  // Toggle Active flag
  toggleActive(user: User): void {
    user.isActive = !user.isActive;
    this.userService.updateFlags(user.userId, user.isActive, user.isAdmin)
      .subscribe({
        next: () => console.log("IsActive updated"),
        error: err => console.error("Error updating IsActive", err)
      });
  }

  // Toggle Admin flag
  toggleAdmin(user: User): void {
    user.isAdmin = !user.isAdmin;
    this.userService.updateFlags(user.userId, user.isActive, user.isAdmin)
      .subscribe({
        next: () => console.log("IsAdmin updated"),
        error: err => console.error("Error updating IsAdmin", err)
      });
   }
  }





