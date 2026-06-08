import { Routes } from '@angular/router';
import { MenuListComponent } from './features/menu/menu-list/menu-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: MenuListComponent }
];
