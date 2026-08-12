import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RefundsUserService } from '../admin/services/refund-user.service';
import { OrderHistoryService, MyOrderDto, MyOrderDetailsDto } from '../admin/services/orderhistory.service';

@Component({
  selector: 'app-refund-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './refund-modal.component.html',
  styleUrls: ['./refund-modal.component.scss']
})
export class RefundModalComponent implements OnInit {
  eligibleOrders: MyOrderDto[] = [];
  selectedOrder: MyOrderDetailsDto | null = null;

  selectedItemId: string = 'all';
  itemDetails: any;
  userRemarks: string = '';
  proofFile?: File;

  constructor(
    private refundsUserService: RefundsUserService,
    private orderHistoryService: OrderHistoryService
  ) {}

  ngOnInit(): void {
    // ✅ Fetch recent orders directly from backend
    this.orderHistoryService.getRecentOrders().subscribe({
      next: (data) => {
        this.eligibleOrders = data;
        console.log('Recent orders:', this.eligibleOrders);
      },
      error: (err) => console.error('Error fetching recent orders', err)
    });
  }

  viewOrderDetails(order: MyOrderDto): void {
    // ✅ Fetch full order details from backend
    this.orderHistoryService.getMyOrdersDetails(order.orderId).subscribe({
      next: (data) => {
        this.selectedOrder = data;
        this.resetForm();
      },
      error: (err) => console.error('Error fetching order details', err)
    });
  }

  fetchItemDetails(): void {
    if (this.selectedItemId === 'all') {
      this.itemDetails = undefined;
    } else {
      this.itemDetails = this.selectedOrder?.orderItems.find(
        (i) => i.foodItemId === +this.selectedItemId
      );
    }
  }

  onFileSelected(event: any): void {
    this.proofFile = event.target.files[0];
  }

  submitRefund(): void {
    if (!this.selectedOrder) return;
    
    const itemId = this.selectedItemId === 'all' ? null : +this.selectedItemId;

    this.refundsUserService
      .claimRefund(
        this.selectedOrder.orderId,
        this.userRemarks,
        itemId,
        this.proofFile
      )
      .subscribe({
        next: () => {
          alert('Refund request submitted!');
          this.resetForm();
        },
        error: () => alert('Failed to submit refund request.')
      });
  }

  private resetForm(): void {
    this.selectedItemId = 'all';
    this.itemDetails = undefined;
    this.userRemarks = '';
    this.proofFile = undefined;
  }
}
