import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
// import { PromocodeComponent } from './components/promocode/promocode.component';

@NgModule({
  declarations: [
    // no declarations, all components are standalone
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AdminRoutingModule,
    AdminHomeComponent,
    AdminMenuComponent,
    AdminUsersComponent
    // PromocodeComponent
  ]
})
export class AdminModule {}






