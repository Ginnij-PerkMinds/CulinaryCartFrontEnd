import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { MenuItem } from '../model/menu-item.model'; 
import { CurrencyPipe, CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],  
  standalone: true,      
  imports: [CurrencyPipe, CommonModule]
})
export class MenuListComponent implements OnInit {
  menuItems: MenuItem[] = [];
  
  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
  this.menuService.getMenu().subscribe({
    next: (response) => {
      console.log('API response:', response);
      this.menuItems = response.data;   
    },
    error: (err) => console.error('Error loading menu', err)
  });
  }
}



