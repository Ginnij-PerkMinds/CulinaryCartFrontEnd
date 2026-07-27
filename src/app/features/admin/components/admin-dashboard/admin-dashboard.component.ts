import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MenuModalComponent } from '../../menu-modal/menu-modal.component';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

Chart.register(...registerables);

// Interfaces for type safety
interface QuickAction {
  label: string;
  icon: string;
  action: () => void;
}

interface CategoryDistribution {
  categoryName: string;
  itemCount: number;
}

interface MenuInsights {
  totalItems: number;
  totalCategories: number;
  totalDietPreferences: number;
  vegItems: number;
  nonVegItems: number;
  veganItems: number;
  ketoItems: number;
  categoryDistribution: CategoryDistribution[];
}

interface RevenueByDate {
  date: string;
  totalRevenue: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModalComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild(MenuModalComponent) menuModal!: MenuModalComponent;

  username: string = 'Admin';
  quickActions: QuickAction[] = [];
  userStats: any = {};
  menuInsights: MenuInsights | null = null;
  orderStats: any = {};
  revenueByDate: RevenueByDate[] = [];
  categoryDistribution: CategoryDistribution[] = [];
  categories: any[] = [];
  dietaryPreferences: any[] = [];

  // Chart instances to avoid overlap
  private ordersChart!: Chart;
  private revenueChart!: Chart;
  private menuInsightsChart!: Chart;
  private categoryChart!: Chart;

  constructor(private http: HttpClient) {}

  openMenuModal() {
    this.menuModal.openAddModal();
  }

  todaysStatus = {
    ordersCompleted: 32,
    pendingOrders: 2,
    ordersinhouse: 6,
  };

  menuSnapshot = {
    topRatedDishes: [
      { name: 'Sushi Platter', rating: 4.9, image: 'assets/images/sushi.jpg' },
      { name: 'Pasta', rating: 4.8, image: 'assets/images/pasta.jpg' },
      { name: 'Paneer Tikka', rating: 4.7, image: 'assets/images/tikka.jpg' }
    ]
  };

  ngOnInit(): void {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      this.username = storedUser;
    }

    this.http.get<MenuInsights>('http://localhost:5209/api/Menu/menu-stats')
      .subscribe({
        next: (data) => {
          this.menuInsights = data;
          this.categoryDistribution = data.categoryDistribution;
          this.renderMenuInsightsChart();
          this.renderCategoryChart();
        },
        error: (err) => console.error('Error fetching menu stats', err)
      });

    this.http.get('http://localhost:5209/api/User/user-stats')
      .subscribe({
        next: (data) => this.userStats = data,
        error: (err) => console.error('Error fetching user stats', err)
      });

    this.http.get('http://localhost:5209/api/Cart/order-stats')
      .subscribe({
        next: (data) => this.orderStats = data,
        error: (err) => console.error('Error fetching order stats', err)
      });

    this.http.get<RevenueByDate[]>('http://localhost:5209/api/Cart/revenue-by-date')
      .subscribe({
        next: (data) => {
          this.revenueByDate = data;
          this.renderRevenueChart();
        },
        error: (err) => console.error('Error fetching revenue stats', err)
      });

    this.renderOrdersPieChart();
  }

  // Order Distribution
  private renderOrdersPieChart(): void {
    if (this.ordersChart) this.ordersChart.destroy();
    this.ordersChart = new Chart('ordersPieChart', {
      type: 'pie',
      data: {
        labels: ['Completed', 'InHouse', 'Pending'],
        datasets: [{
          data: [
            this.todaysStatus.ordersCompleted,
            this.todaysStatus.ordersinhouse,
            this.todaysStatus.pendingOrders
          ],
          backgroundColor: ['#EA4626', '#66BB6A', '#FFA726'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', display: false },
          title: {
            display: true,
            text: 'Orders Distribution',
            color: '#EA4626',
            font: { size: 14, weight: 'bold' }
          }
        }
      }
    });
  }

  // Revenue Chart
  private renderRevenueChart(): void {
    if (this.revenueChart) this.revenueChart.destroy();
    this.revenueChart = new Chart('revenueChart', {
      type: 'line',
      data: {
        labels: this.revenueByDate.map(r => r.date),
        datasets: [{
          data: this.revenueByDate.map(r => r.totalRevenue),
          borderColor: '#EA4626',
          backgroundColor: 'rgba(234,70,38,0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Revenue Over Time',
            color: '#EA4626',
            font: { size: 20, weight: 'bold' }
          }
        }
      }
    });
  }

  // Diet Distribution Chart
  private renderMenuInsightsChart(): void {
    if (this.menuInsightsChart) this.menuInsightsChart.destroy();
    if (!this.menuInsights) return;

    this.menuInsightsChart = new Chart('menuInsightsChart', {
      type: 'pie',
      data: {
        labels: ['Veg', 'Non-Veg', 'Vegan', 'Ketogenic'],
        datasets: [{
          data: [
            this.menuInsights.vegItems,
            this.menuInsights.nonVegItems,
            this.menuInsights.veganItems,
            this.menuInsights.ketoItems
          ],
          backgroundColor: ['#66BB6A', '#EF5350', '#FFCA28', '#8E24AA'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', display: false },
          title: {
            display: true,
            text: 'Menu Distribution (Diets)',
            color: '#EA4626',
            font: { size: 14, weight: 'bold' }
          }
        }
      }
    });
  }

  // Category Distribution Chart
  private renderCategoryChart(): void {
    if (this.categoryChart) this.categoryChart.destroy();
    if (!this.categoryDistribution.length) return;

    this.categoryChart = new Chart('categoryChart', {
      type: 'pie',
      data: {
        labels: this.categoryDistribution.map(c => c.categoryName),
        datasets: [{
          data: this.categoryDistribution.map(c => c.itemCount),
          backgroundColor: ['#42A5F5', '#66BB6A', '#EF5350', '#FFCA28', 
                            '#8E24AA', '#AB47BC'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', display: false },
          title: {
            display: true,
            text: 'Menu Distribution (Categories)',
            color: '#EA4626',
            font: { size: 14, weight: 'bold' }
          }
        }
      }
    });
  }

  refreshSummary() {
    this.http.get<MenuInsights>('http://localhost:5209/api/Menu/menu-stats')
      .subscribe({
        next: (data) => {
          this.menuInsights = data;
          this.categoryDistribution = data.categoryDistribution;
          this.renderMenuInsightsChart();
          this.renderCategoryChart();
        },
        error: (err) => console.error('Error refreshing summary', err)
      });
  }
}