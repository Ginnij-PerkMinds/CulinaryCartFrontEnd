import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { CategoryModalComponent } from '../../category-modal/category-modal.component';
import { DietaryPreferencesComponent } from '../../dietary-preferences-modal/dietary-preferences-modal.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, CategoryModalComponent, DietaryPreferencesComponent],

  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {
  refreshSummary() {
  console.log('Categories/Dietary changed, dashboard should update.');
}
}

