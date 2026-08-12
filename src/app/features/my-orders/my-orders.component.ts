import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RefundsUserService, RefundDto, RefundDetailsDto } from '../admin/services/refund-user.service';
import { OrderHistoryService, MyOrderDto, MyOrderDetailsDto } from '../admin/services/orderhistory.service';
import {RefundModalComponent} from '../refund-modal/refund-modal.component';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, RefundModalComponent],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  // Tabs
  activeTab: string = 'orders';

  // Orders
  orders: MyOrderDto[] = [];
  selectedOrder: MyOrderDetailsDto | null = null;

  // Refunds
  refunds: RefundDto[] = [];
  selectedRefund: RefundDetailsDto | null = null;

  // Refund form fields
  refundItem: string = 'all';
  refundRemarks: string = '';
  refundProofFile: File | null = null;

  constructor(
    private refundsService: RefundsUserService,
    private orderHistoryService: OrderHistoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load orders by default
    this.loadOrders();
  }

  // Switch tabs and load data immediately
  switchTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'orders') {
      this.loadOrders();
    } else if (tab === 'refunds') {
      this.loadRefunds();
    }
  }

  // Load orders
    loadOrders(): void {
    this.orderHistoryService.getMyOrders().subscribe(data => {
      console.log('Orders API response:', data);
      this.orders = data;
    });
  }

  // Load refunds
  // loadRefunds(): void {
  //   this.refundsService.getMyRefunds().subscribe({
  //     next: (data) => this.refunds = data,
  //     error: (err) => console.error('Error loading refunds', err)
  //   });
  // }
  loadRefunds(): void {
  this.refundsService.getMyRefunds().subscribe({
    next: (data) => {
      // Sort refunds by requestDate descending (latest first)
      this.refunds = data.sort((a, b) =>
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );
    },
    error: (err) => console.error('Error loading refunds', err)
  });
}


  // View order details
  viewDetails(orderId: number): void {
    this.orderHistoryService.getMyOrdersDetails(orderId).subscribe({
      next: (data) => {
        this.selectedOrder = data;
        this.resetRefundForm();
      },
      error: (err) => console.error('Error loading order details', err)
    });
  }

  // View refund details
  viewRefundDetails(refundId: number): void {
    this.refundsService.getRefundDetails(refundId).subscribe({
      next: (data) => this.selectedRefund = data,
      error: (err) => console.error('Error loading refund details', err)
    });
  }

  // Reset refund form
  resetRefundForm(): void {
    this.refundItem = 'all';
    this.refundRemarks = '';
    this.refundProofFile = null;
  }

  goBack(): void {
  this.router.navigate(['/menu']);
}
}
