// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { OrdersService, OrderDto, OrderDetailsDto } from '../../services/Orders.service';


// @Component({
//   selector: 'app-orders',
//   standalone: true,
//   imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule],
//   templateUrl: './admin-orders.component.html',
//   styleUrls: ['./admin-orders.component.scss']
// })
// export class OrdersComponent implements OnInit {
//   @ViewChild('rejectModal') rejectModal!: ElementRef;

//   activeTab: string = 'all';
//   orders: OrderDto[] = [];
//   selectedOrder?: OrderDetailsDto;

//   rejectOrderId?: number;
//   rejectRemarks: string = '';

//   constructor(private ordersService: OrdersService) {}

//   ngOnInit(): void {
//     this.loadOrders('all');
//   }
  
//   loadOrders(tab: string): void {
//   this.activeTab = tab;
//   if (tab === 'all') {
//     this.ordersService.getAllOrders().subscribe(data => {
//       this.orders = data.sort((a, b) =>
//         new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
//       );
//     });
//   } else {
//     this.ordersService.getOrdersByStatus(tab).subscribe(data => {
//       this.orders = data.sort((a, b) =>
//         new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
//       );
//     });
//   }
// }

//   viewDetails(id: number): void {
//     this.ordersService.getOrderDetails(id).subscribe(data => this.selectedOrder = data);
//   }

//   acceptOrder(id: number): void {
//     this.ordersService.acceptOrder(id).subscribe(() => this.loadOrders(this.activeTab));
//   }
  
//  rejectOrder(id: number): void {
//     this.ordersService.rejectOrder(id, 'Rejected by admin').subscribe({
//         next: () => {
//           import('bootstrap').then(({ Toast }) => {
//             const toastEl = document.getElementById('rejectToast');
//             if (toastEl) {
//               const toast = new Toast(toastEl);
//               toast.show();
//             }
//           });
//           this.loadOrders(this.activeTab);
//         },
//         error: () => alert('Failed to reject order.')
//       });
//   }
  
// markDelivered(id: number): void {
//   this.ordersService.markDelivered(id).subscribe({
//     next: () => {
//       import('bootstrap').then(({ Toast }) => {
//         const toastEl = document.getElementById('deliverToast');
//         if (toastEl) {
//           const toast = new Toast(toastEl);
//           toast.show();
//         }
//       });
//       this.loadOrders(this.activeTab);
//     },
//     error: () => alert('Failed to mark order as delivered.')
//   });
// }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService, OrderDto, OrderDetailsDto } from '../../services/Orders.service';
import { AnyCaaRecord } from 'dns';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class OrdersComponent implements OnInit {
  activeTab: string = 'all';
  orders: OrderDto[] = [];
  selectedOrder?: OrderDetailsDto;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders('all');
  }

  loadOrders(tab: string): void {
    this.activeTab = tab;
    if (tab === 'all') {
      this.ordersService.getAllOrders().subscribe(data => {
        this.orders = data.sort((a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
      });
    } else {
      this.ordersService.getOrdersByStatus(tab).subscribe(data => {
        this.orders = data.sort((a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
      });
    }
  }

  viewDetails(id: number): void {
    this.ordersService.getOrderDetails(id).subscribe(data => this.selectedOrder = data);
  }

  /** Shared toast helper */
  private showToast(message: string, type: 'success' | 'danger' | 'primary') {
    const toastEl = document.getElementById('orderToast');
    const toastBody = document.getElementById('orderToastBody');

    if (toastEl && toastBody) {
      toastEl.className = 'toast align-items-center border-0 text-bg-' + type;
      toastBody.textContent = message;

      import('bootstrap').then(({ Toast }) => {
        const toast = new Toast(toastEl, { delay: 3000 }); // auto-hide after 3s
        toast.show();
      });
    }
  }

  acceptOrder(id: number): void {
    this.ordersService.acceptOrder(id).subscribe({
      next: (res:any) => {
        this.loadOrders(this.activeTab);
        this.showToast(res.message, 'primary');
      },
      error: () => this.showToast(`Failed to accept order #${id}`, 'danger')
    });
  }

  rejectOrder(id: number): void {
    this.ordersService.rejectOrder(id, 'Rejected by admin').subscribe({
      next: (res:any) => {
        this.loadOrders(this.activeTab);
        this.showToast(res.message, 'danger');
      },
      error: () => this.showToast(`Failed to reject order #${id}`, 'danger')
    });
  }

  markDelivered(id: number): void {
    this.ordersService.markDelivered(id).subscribe({
      next: (res:any) => {
        this.loadOrders(this.activeTab);
        this.showToast(res.message, 'success');
      },
      error: () => this.showToast(`Failed to deliver order #${id}`, 'danger')
    });
  }
}
