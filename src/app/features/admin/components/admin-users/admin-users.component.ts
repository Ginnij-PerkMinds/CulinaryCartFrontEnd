import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
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

