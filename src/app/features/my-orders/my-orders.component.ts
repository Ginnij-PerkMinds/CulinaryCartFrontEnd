import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RefundsUserService } from '../admin/services/refund-user.service';
import { OrderHistoryService } from '../admin/services/orderhistory.service';
import { MyOrderDto, MyOrderDetailsDto } from '../admin/services/orderhistory.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: MyOrderDto[] = [];
  selectedOrder: MyOrderDetailsDto | null = null;

  refundItem: string = 'all';
  refundRemarks: string = '';
  refundProofFile: File | null = null;

  constructor(private refundsService: RefundsUserService,
              private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderHistoryService.getMyOrders().subscribe(data => {
      console.log('Orders API response:', data);
      this.orders = data;
    });
  }

  viewDetails(orderId: number): void {
    this.orderHistoryService.getMyOrdersDetails(orderId).subscribe(data => {
      this.selectedOrder = data;
      this.resetRefundForm();
    });
  }

  resetRefundForm(): void {
    this.refundItem = 'all';
    this.refundRemarks = '';
    this.refundProofFile = null;
  }

  onFileSelected(event: any): void {
    this.refundProofFile = event.target.files[0];
  }

  submitRefund(orderId: number): void {
    this.refundsService.claimRefund(
      orderId,
      this.refundRemarks,
      this.refundItem,
      this.refundProofFile || undefined
    ).subscribe(() => {
      alert('Refund request submitted successfully!');
      this.loadOrders();
    });
  }
}
