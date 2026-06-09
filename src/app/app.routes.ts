import { Routes } from '@angular/router';
import { MenuListComponent } from './features/menu/menu-list/menu-list.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';


export const routes: Routes = [
  { path: 'menu', component: MenuListComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: '**', redirectTo: 'menu' }
];
