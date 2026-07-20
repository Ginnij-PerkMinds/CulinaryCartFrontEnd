import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MenuModalComponent } from '../../menu-modal/menu-modal.component';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 

Chart.register(...registerables);

interface QuickAction {
  label: string;
  icon: string;
  action: () => void; // instead of route, we bind to a function
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule, MenuModalComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  @ViewChild(MenuModalComponent) menuModal!: MenuModalComponent;

  username: string = 'Admin';
  quickActions: QuickAction[] = [];
  userStats: any = {};
  menuInsights: any = {};
  orderStats: any= {};
  revenueByDate: any = {};
  categoryDistribution: any[]=[];
  categories: any[] = [];
  dietaryPreferences: any[] = [];

  constructor(private http: HttpClient) {} 

  openMenuModal() {
  this.menuModal.openAddModal();
}

  todaysStatus = {
    ordersCompleted: 32,
    pendingOrders: 2,
    ordersinhouse:6,
  };

  menuSnapshot = {
    totalItems: 120,
    lowStockAlerts: 8,
    outOfStock: 5,
    activeOffers: 3,
    topRatedDishes:[ 
      {name: 'Sushi Platter',rating: 4.9,image: 'assets/images/sushi.jpg'},
      { name: 'Pasta', rating: 4.8, image: 'assets/images/pasta.jpg' },
      { name: 'Paneer Tikka', rating: 4.7, image: 'assets/images/tikka.jpg' }
    ]
  };
  
  customerInsights = {
    newCustomersToday: 12,
    feedbackCount: 8,
    complaintsCount: 3
  };

  ngOnInit(): void {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      this.username = storedUser;
    }

    // Initialize quick actions with modal triggers
    this.quickActions = [
      { label: 'Add Item', icon: 'bi bi-plus-circle', action: () => this.menuModal.openAddModal() },
      { label: 'Add Category', icon: 'bi bi-folder-plus', action: () => console.log('Open Add Category Modal') },
      { label: 'Add Diet', icon: 'bi bi-heart-fill', action: () => console.log('Open Add Diet Modal') },
      { label: 'Update Stock', icon: 'bi bi-box-seam', action: () => console.log('Open Update Stock Modal') },
      { label: 'Apply Offers', icon: 'bi bi-tag-fill', action: () => console.log('Open Apply Offers Modal') }
    ];

    this.http.get('http://localhost:5209/api/Menu/menu-stats')
      .subscribe((data: any) => {
        this.menuInsights = data;
        this.categoryDistribution = data.categoryDistribution;
        this.renderMenuInsightsChart();   // render chart after data arrives
        this.renderCategoryChart();
      });

     this.http.get('http://localhost:5209/api/User/user-stats').subscribe((data: any) => {
      this.userStats = data;
    });

     this.http.get('http://localhost:5209/api/Cart/order-stats')
    .subscribe((data: any) => {
      this.orderStats = data;
    });

    this.http.get('http://localhost:5209/api/Cart/revenue-by-date')
  .subscribe((data: any) => {
    this.revenueByDate = data;
    this.renderRevenueChart();
});

    this.renderOrdersPieChart();
    this.renderMenuChart();
    // this.renderCustomerChart();
  }
   private renderMenuInsightsChart(): void {
    new Chart('menuInsightsChart', {
      type: 'pie',
      data: {
        labels: [ 'Veg', 'Non-Veg', 'Vegan', 'Ketogenic'],
        datasets: [{
          data: [
            // this.menuInsights.totalItems,
            this.menuInsights.vegItems,
            this.menuInsights.nonVegItems,
            this.menuInsights.veganItems,
            this.menuInsights.ketoItems
          ],
          backgroundColor: [ '#66BB6A', '#EF5350', '#FFCA28', '#8E24AA'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom',
                    display: false },
          title: {
            display: true,
            text: 'Menu Distribution (Diets)',
            color: '#EA4626',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }
    // Category Distribution Chart
  private renderCategoryChart(): void {
    new Chart('categoryChart', {
      type: 'pie',
      data: {
        labels: this.categoryDistribution.map(c => c.categoryName),
        datasets: [{
          data: this.categoryDistribution.map(c => c.itemCount),
          backgroundColor: ['#42A5F5', '#66BB6A', '#EF5350', '#FFCA28', '#8E24AA', '#AB47BC'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom',
                    display:false },
          title: {
            display: true,
            text: 'Menu Distribution (Categories)',
            color: '#EA4626',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }
  
  // handleQuickAction(action: QuickAction): void {
  //   action.action();
  // }

  private renderOrdersPieChart(): void {
    new Chart('ordersPieChart', {
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
          legend: { position: 'bottom', display:false },
          title: {
            display: true,
            text: 'Orders Distribution',
            color: '#EA4626',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    });
  }

  private renderRevenueChart(): void {
  new Chart('revenueChart', {
    type: 'line',
    data: {
      labels: this.revenueByDate.map((r: any) => r.date),
      datasets: [{
        // label: 'Revenue by Date',
        data: this.revenueByDate.map((r: any) => r.totalRevenue),
        borderColor: '#EA4626',
        backgroundColor: 'rgba(234,70,38,0.2)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend:{
         display:false
        },
        title: {
          display: true,
          // text: 'Daily Revenue',
          color: '#EA4626',
          font: { size: 20, weight: 'bold' }
        }
      }
    }
  });
}


  private renderMenuChart(): void {
    new Chart('menuChart', {
      type: 'bar',
      data: {
        labels: ['Total Items', 'Low Stock', 'Out of Stock', 'Active Offers'],
        datasets: [{
          label: 'Menu Snapshot',
          data: [
            this.menuSnapshot.totalItems,
            this.menuSnapshot.lowStockAlerts,
            this.menuSnapshot.outOfStock,
            this.menuSnapshot.activeOffers
          ],
          backgroundColor: ['#EA4626', '#FF7043', '#FFA726', '#FB8C00']
        }]
      }
    });
  }
  refreshSummary() {
  // Call your backend to reload menu stats
  this.http.get('http://localhost:5209/api/Menu/menu-stats').subscribe({
    next: (data: any) => {
      this.menuInsights = data;
      this.categoryDistribution = data.categoryDistribution;

      // re-render charts with new data
      this.renderMenuInsightsChart();
      this.renderCategoryChart();
    },
    error: (err) => console.error('Error refreshing summary', err)
  });
}
}