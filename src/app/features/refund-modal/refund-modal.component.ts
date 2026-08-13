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

  selectAllChecked: boolean = false;

  selectedItemId: string = 'all';
  itemDetails: any;
  userRemarks: string = '';
  proofFile?: File;

  constructor(
    private refundsUserService: RefundsUserService,
    private orderHistoryService: OrderHistoryService
  ) {}

  ngOnInit(): void {
    //  Fetch recent orders directly from backend
    this.orderHistoryService.getRecentOrders().subscribe({
      next: (data) => {
        this.eligibleOrders = data;
        console.log('Recent orders:', this.eligibleOrders);
      },
      error: (err) => console.error('Error fetching recent orders', err)
    });
  }

  viewOrderDetails(order: MyOrderDto): void {
    //  Fetch full order details from backend
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

  toggleAllItems() {
  if (!this.selectedOrder) return;
  this.selectedOrder.orderItems.forEach(item => item.checked = this.selectAllChecked);
}

toggleSingleItem() {
  if (!this.selectedOrder) return;
  // If any item is unchecked, uncheck "All Items"
  if (this.selectedOrder.orderItems.some(item => !item.checked)) {
    this.selectAllChecked = false;
  } else {
    // If all items are checked, check "All Items"
    this.selectAllChecked = true;
  }
}

get selectedItemsTotal(): number {
  if (!this.selectedOrder) return 0;

  // If "All Items" is checked, sum all
  if (this.selectAllChecked) {
    return this.selectedOrder.orderItems.reduce((sum, i) => sum + i.finalPrice, 0);
  }

  // Otherwise sum only checked items
  return this.selectedOrder.orderItems
    .filter(i => i.checked)
    .reduce((sum, i) => sum + i.finalPrice, 0);
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