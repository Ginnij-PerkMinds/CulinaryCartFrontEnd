import { Routes } from '@angular/router';
import { MenuListComponent } from './features/menu/menu-list/menu-list.component';
import { LandingComponent } from './public/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminHomeComponent } from './features/admin/components/admin-home/admin-home.component';
import { AdminMenuComponent } from './features/admin/components/admin-menu/admin-menu.component';
import { AdminUsersComponent } from './features/admin/components/admin-users/admin-users.component';
import { AdminGuard } from './core/Guards/admin.guard';
import { AdminDashboardComponent } from './features/admin/components/admin-dashboard/admin-dashboard.component';
import { AdminCategoryComponent } from './features/admin/components/admin-category/admin-category.component';
import { AdminDietaryPreferenceComponent } from './features/admin/components/admin-dietarypreference/admin-dietarypreference.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'menu', component: MenuListComponent },
  
  {
    path: 'admin',
    component: AdminHomeComponent,
    canActivate: [AdminGuard],
    children: [
      {path:'dashboard',component: AdminDashboardComponent},
      { path: 'menu', component: AdminMenuComponent },
      { path: 'users', component: AdminUsersComponent },
      {path: 'category', component: AdminCategoryComponent},
      {path: 'dietarypreference', component: AdminDietaryPreferenceComponent},
      {path:'', redirectTo: 'dashboard', pathMatch:'full'}
    ]
  },
  { path: '**', redirectTo: '' }
];