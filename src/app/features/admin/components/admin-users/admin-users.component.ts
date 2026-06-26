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

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.map(user => ({
          ...user,
          createdAtFormatted: this.datePipe.transform(user.createdAt, 'dd MMM yyyy, hh:mm a') || '',
          updatedAtFormatted: user.updatedAt ? this.datePipe.transform(user.updatedAt, 'dd MMM yyyy, hh:mm a') || '' : ''
        }));
      },
      error: (err) => console.error('Failed to load portal accounts:', err)
    });
  }

  toggleActive(user: User): void {
    const nextState = !user.isActive;
    this.userService.updateFlags(user.userId, nextState, user.isAdmin).subscribe({
      next: () => {
        user.isActive = nextState;
        console.log('Account activity updated successfully.');
      },
      error: (err) => console.error('Failed to commit structural flag update:', err)
    });
  }

  toggleAdmin(user: User): void {
    const nextState = !user.isAdmin;
    this.userService.updateFlags(user.userId, user.isActive, nextState).subscribe({
      next: () => {
        user.isAdmin = nextState;
        console.log('Account clearance rights updated successfully.');
      },
      error: (err) => console.error('Failed to commit structural clearance update:', err)
    });
  }
}