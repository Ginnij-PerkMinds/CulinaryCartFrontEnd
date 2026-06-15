import { Routes } from '@angular/router';
import { MenuListComponent } from './features/menu/menu-list/menu-list.component';
import {LandingComponent} from "./public/landing/landing.component";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminComponent } from './features/admin/admin/admin.component';



export const routes: Routes = [
  {path: '', component: LandingComponent},
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'menu', component: MenuListComponent },
  { path:'admin', component:AdminComponent},
  { path: '**', redirectTo: '' }
];
