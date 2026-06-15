// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AdminRoutingModule } from './admin-routing.module';
// import { AdminComponent } from './admin/admin.component';

// @NgModule({
//   imports: [
//     CommonModule,
//     AdminRoutingModule,
//     AdminComponent   // ✅ import standalone component
//   ]
// })
// export class AdminModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminComponent   // ✅ import standalone component
  ]
})
export class AdminModule {}

