import { NgModule } from '@angular/core';
import { CommonModule, DatePipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';

@NgModule({
  declarations: [
  ],
  providers: [
    { provide: DatePipe, useClass: DatePipe },
    { provide: 'TIMEZONE', useValue: 'Asia/Kolkata' }
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AdminRoutingModule,
    AdminHomeComponent,
    AdminMenuComponent,
    AdminUsersComponent
  ]
})
export class AdminModule {}