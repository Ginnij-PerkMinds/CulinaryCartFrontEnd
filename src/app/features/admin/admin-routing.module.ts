// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { AdminComponent } from './admin/admin.component';

// const routes: Routes = [
//   { path: '', component: AdminComponent }   // ✅ /admin loads AdminComponent
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class AdminRoutingModule {}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: AdminComponent }   // ✅ /admin → AdminComponent
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}



