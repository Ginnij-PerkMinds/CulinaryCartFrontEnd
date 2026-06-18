import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminGuard } from './services/admin.guard';   //<---added

const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    children: [
      { path: 'menu', component: AdminMenuComponent },
      { path: 'users', component: AdminUsersComponent },
      {path: 'admin', component: AdminHomeComponent, canActivate:[AdminGuard]},  // <---added
      { path: '', redirectTo: 'menu', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}






