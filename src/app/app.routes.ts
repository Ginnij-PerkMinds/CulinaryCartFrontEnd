import { Routes } from '@angular/router';
import { MenuListComponent } from './features/menu/menu-list/menu-list.component';
import { LandingComponent } from './public/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminHomeComponent } from './features/admin/components/admin-home/admin-home.component';
import { AdminMenuComponent } from './features/admin/components/admin-menu/admin-menu.component';
import { AdminUsersComponent } from './features/admin/components/admin-users/admin-users.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'menu', component: MenuListComponent },
  {
    path: 'admin',
    component: AdminHomeComponent,
    children: [
      { path: 'menu', component: AdminMenuComponent },
      { path: 'users', component: AdminUsersComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

